const Flight = require('../models/Flight');
const Airport = require('../models/Airport');
const Aircraft = require('../models/Aircraft');

const getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.aggregate([
            {
                $lookup: {
                    from: 'airports',
                    localField: 'departure_airport_id',
                    foreignField: '_id',
                    as: 'departure_airport'
                }
            },
            {
                $lookup: {
                    from: 'airports',
                    localField: 'arrival_airport_id',
                    foreignField: '_id',
                    as: 'arrival_airport'
                }
            },
            {
                $unwind: '$departure_airport'
            },
            {
                $unwind: '$arrival_airport'
            }
        ]);
        return res.status(200).json(flights);
    } catch (error) {
        console.error("Error fetching flights", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * Support function to find flights.
 * @param departCity
 * @param arriveCity
 * @param departDate
 * @returns {Promise<Aggregate<Array<any>>>}
 */
const getFlights = async (departCity, arriveCity, departDate) => {
    try {
        return await Flight.aggregate([
            {
                $lookup: {
                    from: 'airports',
                    localField: 'departure_airport_id',
                    foreignField: '_id',
                    as: 'departure_airport'
                }
            },
            {
                $lookup: {
                    from: 'airports',
                    localField: 'arrival_airport_id',
                    foreignField: '_id',
                    as: 'arrival_airport'
                }
            },
            {
                $match: {
                    'departure_airport.city': departCity,
                    'arrival_airport.city': arriveCity,
                    'departure_time': departDate
                }
            },
            {
                $unwind: '$departure_airport'
            },
            {
                $unwind: '$arrival_airport'
            }
        ]);
    } catch (error) {
        console.error("Error fetching flights", error);
        throw new Error(error.message);
    }
};

const getFlightsOneWay = async (req, res) => {
    let {departCity, arriveCity, departDate} = req.body;
    if (departDate === null) {
        const date = new Date();
        departDate = date.toISOString();
    }

    try {
        const flights = await getFlights(departCity, arriveCity, departDate);
        if (flights.length === 0) {
            return res.status(404).json({ status: false, message: "No flights found" });
        }
        return res.status(200).json(flights);
    } catch (error) {
        console.error("Error fetching flights", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

const getFlightsRoundTrip = async (req, res) => {
    let {departCity, arriveCity, departDate, arriveDate} = req.body;
    if (departDate === null) {
        const date = new Date();
        departDate = date.toISOString();
    }
    if (arriveDate === null) {
        const date = new Date();
        arriveDate = date.toISOString();
    }
    try {
        const outboundFlights = await getFlights(departCity, arriveCity, departDate);

        const returnFlights = await getFlights(arriveCity, departCity, arriveDate);

        if (outboundFlights.length === 0) {
            return res.status(404).json({ status: false, message: "No outbound flights found" });
        }

        if (returnFlights.length === 0) {
            return res.status(404).json({ status: false, message: "No return flights found" });
        }

        return res.status(200).json({
            outboundFlights,
            returnFlights
        });
    } catch (error) {
        console.error("Error fetching flights", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * Support function to show can or not make new flight.
 * @param flightID
 * @param aircraftID
 * @param departureTime
 * @param arrivalTime
 * @returns {Promise<boolean>}
 */
async function canMakeNewFlight(flightID, aircraftID, departureTime, arrivalTime) {

    // Handle for case aircraft not exist
    const aircraft = await Aircraft.findOne({
        aircraft_number: aircraftID
    });
    if (!aircraft) {
        return false;
    }

    // Handle for case overlap ID
    const conflictIDFlights = await Flight.findOne({
        flight_number: flightID
    });
    if (conflictIDFlights) {
        return false;
    }

    // Handle for case overlap time
    const twelveHoursBefore = new Date(departureTime);
    twelveHoursBefore.setHours(twelveHoursBefore.getHours() - 12);

    const twelveHoursAfter = new Date(arrivalTime);
    twelveHoursAfter.setHours(twelveHoursAfter.getHours() + 12);

    const conflictTimeFlights = await Flight.findOne({
        aircraft_id: aircraftID,
        $or: [
            {
                departure_time: { $lt: twelveHoursAfter, $gte: twelveHoursBefore },
            },
            {
                arrival_time: { $lt: twelveHoursAfter, $gte: twelveHoursBefore },
            },
            {
                departure_time: { $lte: twelveHoursBefore },
                arrival_time: { $gte: twelveHoursAfter },
            },
        ],
    });

    return !conflictTimeFlights;
}

const addFlight = async (req, res) => {
    let {
        flightID,
        aircraftID,
        departureAirportID,
        arrivalAirportID,
        departureTime,
        arrivalTime,
        priceEconomy,
        priceBusiness
    } = req.body;

    try {
        const canSchedule = await canMakeNewFlight(flightID, aircraftID, departureTime, arrivalTime);
        if (!canSchedule) {
            return res.status(400).json({ error: 'Cant make new flight.' });
        }

        const aircraft = await Aircraft.findOne({
            aircraft_number: aircraftID
        });

        const availableSeats = aircraft.seat_classes.map(seatClass => {
            let price = 0;
            if (seatClass.class_type === 'Economy') {
                price = priceEconomy;
            } else {
                price = priceBusiness;
            }

            return {
                class_type: seatClass.class_type,
                seat_count: seatClass.seat_count,
                price: price
            };
        });

        const newFlight = new Flight({
            flight_number: flightID,
            aircraft_id: aircraftID,
            departure_airport_id: departureAirportID,
            arrival_airport_id: arrivalAirportID,
            departure_time: departureTime,
            arrival_time: arrivalTime,
            available_seats: availableSeats,
            status: "Scheduled"
        });
        await newFlight.save();
        res.status(200).json("Flight added successfully");

    } catch (error) {
        console.error("Error adding flight", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {getAllFlights, getFlightsOneWay, getFlightsRoundTrip, addFlight};