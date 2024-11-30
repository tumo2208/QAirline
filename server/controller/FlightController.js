const Flight = require('../models/Flight');
const Aircraft = require('../models/Aircraft');
const Airport = require('../models/Airport');
const moment = require('moment-timezone');

const updateFlightStatus = async () => {
    try {
        const now = new Date();
        const result = await Flight.updateMany(
            { status: 'Scheduled', departure_time: { $lte: now } },
            { $set: { status: 'HasFlied' } }
        );
        console.log(`[${new Date().toISOString()}] Updated ${result.nModified} flights to 'HasFlied'.`);
    } catch (error) {
        console.error('Error updating flight statuses:', error);
    }
};

const getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.aggregate([
            {
                $lookup: {
                    from: 'airports',
                    localField: 'departure_airport_id',
                    foreignField: 'airport_code',
                    as: 'departure_airport'
                }
            },
            {
                $lookup: {
                    from: 'airports',
                    localField: 'arrival_airport_id',
                    foreignField: 'airport_code',
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
        const startOfDay = moment.tz(departDate, "YYYY-MM-DD", "UTC").startOf('day').toDate();
        const endOfDay = moment.tz(departDate, "YYYY-MM-DD", "UTC").endOf('day').toDate();

        return await Flight.aggregate([
            {
                $lookup: {
                    from: 'airports',
                    localField: 'departure_airport_id',
                    foreignField: 'airport_code',
                    as: 'departure_airport'
                }
            },
            {
                $lookup: {
                    from: 'airports',
                    localField: 'arrival_airport_id',
                    foreignField: 'airport_code',
                    as: 'arrival_airport'
                }
            },
            {
                $match: {
                    'departure_airport.city': departCity,
                    'arrival_airport.city': arriveCity,
                    'departure_time': {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
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
            return res.status(403).json({ status: false, message: "No outbound flights found" });
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
 * Support function to show can or not make new flight because of overlap time.
 * @param flightID
 * @param aircraftID
 * @param departureTime
 * @param arrivalTime
 * @returns {Promise<boolean>}
 */
async function canScheduleNewFlight(flightID, aircraftID, departureTime, arrivalTime) {

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
        const user = req.user;
        if (user.user_type !== 'Admin') {
            return res.status(405).json({error: 'You do not have access to this function'});
        }

        // Handle for case aircraft not exist
        const aircraft = await Aircraft.findOne({
            aircraft_number: aircraftID
        });
        if (!aircraft) {
            return res.status(400).json({ error: 'This aircraft ID is not existed'});
        }

        // Handle for case overlap ID
        const conflictIDFlights = await Flight.findOne({
            flight_number: flightID
        });
        if (conflictIDFlights) {
            return res.status(401).json({ error: 'This flight ID is existed'});
        }

        const canSchedule = await canScheduleNewFlight(flightID, aircraftID, departureTime, arrivalTime);
        if (!canSchedule) {
            return res.status(402).json({ error: 'The time of this aircraft is overlapped' });
        }

        // Handle for case international flight but airport not
        const departureAirport = await Airport.findOne({
            airport_code: departureAirportID
        });
        const arrivalAirport = await Airport.findOne({
            airport_code: arrivalAirportID
        });
        let isInternational = false;
        if (departureAirport.country !== 'Vietnam' || arrivalAirport.country !== 'Vietnam') {
            isInternational = true;
        }
        if (isInternational && !departureAirport.is_international) {
            return res.status(403).json({ error: 'Departure airport does not support for international flight'});
        }
        if (isInternational && !arrivalAirport.is_international) {
            return res.status(404).json({ error: 'Arrival airport does not support for international flight'});
        }

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
            status: "Scheduled",
            is_international: isInternational
        });
        await newFlight.save();
        res.status(200).json("Flight added successfully");

    } catch (error) {
        console.error("Error adding flight", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const setDelayTime = async (req, res) => {
    try {
        const {flightID, newTime} = req.body;
        const flight = await Flight.findOne({
            flight_number: flightID
        });

        if (!flight) {
            return res.status(404).json({ error: "Flight not found." });
        }

        const oldDepartDate = new Date(flight.departure_time);
        const oldArrivalDate = new Date(flight.arrival_time);
        const timeDif = oldArrivalDate - oldDepartDate;

        const newDepartDate = new Date(newDate);
        const newArrivalDate = new Date(newDepartDate.getTime() + timeDif);

        flight.departure_date = newDepartDate;
        flight.arrival_date = newArrivalDate;

        await flight.save();

        res.status(200).json("Flight dates updated successfully!");

    }  catch (error) {
        console.error("Error set delay for flight", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {getAllFlights, getFlightsOneWay, getFlightsRoundTrip, addFlight, updateFlightStatus, setDelayTime};