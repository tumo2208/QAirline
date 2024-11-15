const Flight = require('../models/Flight');
const Airport = require('../models/Airport');

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
    let {departCity, arriveCity, departDate} = req.params;
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
    let {departCity, arriveCity, departDate, arriveDate} = req.params;
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

module.exports = {getAllFlights, getFlightsOneWay, getFlightsRoundTrip };