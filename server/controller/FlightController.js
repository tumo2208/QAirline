const Flight = require('../models/Flight');
const Aircraft = require('../models/Aircraft');
const Airport = require('../models/Airport');
const moment = require('moment-timezone');

const updateFlightStatus = async () => {
    try {
        const now = new Date();
        await Flight.updateMany(
            { status: 'Scheduled', departure_time: { $lte: now } },
            { $set: { status: 'HasFlied' } }
        );
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái chuyến bay:', error);
    }
};

const updatePrepareFlight = async () => {
    try {
        const now = new Date();
        const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const flights = await Flight.find({
            departure_time: { $gte: now, $lt: oneDayLater },
        });

        for (const flight of flights) {
            const notificationMessage = `Chuyến bay của bạn chuẩn bị cất cánh vào lúc ${flight.departure_time.toISOString()}, vui lòng chuẩn bị`;

            if (!flight.notification.includes(notificationMessage)) {
                flight.notification.push(notificationMessage);
                await flight.save();
            }
        }
    }  catch (error) {
        console.error('Lỗi cập nhật thông báo chuyến bay:', error);
    }
};

const getFlightByID = async (req, res) => {
    try {
        const {flightID} = req.body;
        const flight = await Flight.findOne({
            flight_number: flightID
        });
        if (!flight) {
            return res.status(404).json("Không tìm thấy chuyến bay");
        }
        return res.status(200).json(flight);
    }  catch (error) {
        console.error("Lỗi lấy ID chuyến bay", error);
        return res.status(500).json({ status: false, message: error.message });
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

const getFLightByArrival = async (req, res) => {
    try {
        const {arrivalCity} = req.body;
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
                $match: {
                    'arrival_airport.city': arrivalCity
                }
            },
            {
                $unwind: '$departure_airport'
            },
            {
                $unwind: '$arrival_airport'
            }
        ]);

        if (flights.length === 0) {
            return res.status(404).json("Không tìm thấy chuyến bay");
        }

        return res.status(200).json(flights);
    } catch (error) {
        console.error("Lỗi không tìm được chuyến bay bằng điểm đến", error);
        return res.status(505).json({ status: false, message: error.message });
    }
};

const getFlightByDepartureAndArrival = async (req, res) => {
    try {
        const { departureCity, arrivalCity } = req.body;

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
                $match: {
                    'departure_airport.city': departureCity,
                    'arrival_airport.city': arrivalCity,
                    'status': "Scheduled",
                }
            },
            {
                $unwind: '$departure_airport'
            },
            {
                $unwind: '$arrival_airport'
            }
        ]);

        if (flights.length === 0) {
            return res.status(404).json("Không tìm thấy chuyến bay phù hợp");
        }

        return res.status(200).json(flights);
    } catch (error) {
        console.error("Lỗi không tìm được chuyến bay bằng điểm khởi hành, điểm đến và thời gian", error);
        return res.status(505).json({ status: false, message: error.message });
    }
};



const getFlightByDepartureDate = async (req, res) => {
    try {
        const {departDate} = req.body;
        const startOfDay = moment.tz(departDate, "YYYY-MM-DD", "UTC").startOf('day').toDate();
        const endOfDay = moment.tz(departDate, "YYYY-MM-DD", "UTC").endOf('day').toDate();

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
                $match: {
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

        if (flights.length === 0) {
            return res.status(404).json("Không tìm thấy chuyến bay");
        }

        return res.status(200).json(flights);
    } catch (error) {
        console.error("Lỗi không tìm được chuyến bay bằng thời gian bay", error);
        return res.status(505).json({ status: false, message: error.message });
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
        const now = moment().toDate();

        const matchCriteria = {
            'departure_airport.city': departCity,
            'arrival_airport.city': arriveCity
        };

        if (departDate) {
            const startOfDay = moment.tz(departDate, "YYYY-MM-DD", "UTC").startOf('day').toDate();
            const endOfDay = moment.tz(departDate, "YYYY-MM-DD", "UTC").endOf('day').toDate();
            matchCriteria['departure_time'] = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        } else {
            matchCriteria['departure_time'] = { $gte: now };
        }

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
                $match: matchCriteria
            },
            {
                $unwind: '$departure_airport'
            },
            {
                $unwind: '$arrival_airport'
            }
        ]);
    } catch (error) {
        console.error("Lỗi truy cập chuyến bay", error);
        throw new Error(error.message);
    }
};

const getFlightsOneWay = async (req, res) => {
    const {departCity, arriveCity, departDate} = req.body;

    try {
        const flights = await getFlights(departCity, arriveCity, departDate);
        if (flights.length === 0) {
            return res.status(404).json({ status: false, message: "Không tìm thấy chuyến bay" });
        }
        return res.status(200).json(flights);
    } catch (error) {
        console.error("Lỗi truy cập chuyến bay", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

const getFlightsRoundTrip = async (req, res) => {
    const {departCity, arriveCity, departDate, arriveDate} = req.body;

    try {
        const outboundFlights = await getFlights(departCity, arriveCity, departDate);

        const returnFlights = await getFlights(arriveCity, departCity, arriveDate);

        if (outboundFlights.length === 0) {
            return res.status(403).json({ status: false, message: "Không tìm thấy chuyến bay xuất phát" });
        }

        if (returnFlights.length === 0) {
            return res.status(404).json({ status: false, message: "Không tìm thấy chuyến bay về" });
        }

        return res.status(200).json({
            outboundFlights,
            returnFlights
        });
    } catch (error) {
        console.error("Lỗi truy cập chuyến bay", error);
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
            return res.status(405).json({error: 'Bạn không có quyền để sử dụng chức năng này!'});
        }

        // Handle for case aircraft not exist
        const aircraft = await Aircraft.findOne({
            aircraft_number: aircraftID
        });
        if (!aircraft) {
            return res.status(400).json({ error: 'Mã máy bay không tồn tại'});
        }

        // Handle for case overlap ID
        const conflictIDFlights = await Flight.findOne({
            flight_number: flightID
        });
        if (conflictIDFlights) {
            return res.status(401).json({ error: 'Mã chuyến bay đã tồn tại'});
        }

        const canSchedule = await canScheduleNewFlight(flightID, aircraftID, departureTime, arrivalTime);
        if (!canSchedule) {
            return res.status(402).json({ error: 'Thời gian bay trùng lặp' });
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
            return res.status(403).json({ error: 'Sân bay điểm xuất phát không được hỗ trợ cho chuyến bay quốc tế' });
        }
        if (isInternational && !arrivalAirport.is_international) {
            return res.status(404).json({ error: 'Sân bay điểm đến không được hỗ trợ cho chuyến bay quốc tế'});
        }

        const availableSeats = aircraft.seat_classes.map(seatClass => {
            let price;
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
        res.status(200).json("Máy bay cập nhật thành công");

    } catch (error) {
        console.error("Lỗi cập nhật máy bay", error);
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

        // const oldDepartDate = new Date(flight.departure_time);
        // const oldArrivalDate = new Date(flight.arrival_time);
        // const timeDif = oldArrivalDate - oldDepartDate;

        const newDepartDate = new Date(newTime);
        // const newArrivalDate = new Date(newDepartDate.getTime() + timeDif);

        // flight.departure_date = newDepartDate;
        // flight.arrival_date = newArrivalDate;

        const delayMessage = `Chuyến bay của bạn đã bị delay sang ${newDepartDate.toISOString()}`;
        flight.notification.push(delayMessage);

        await flight.save();

        res.status(200).json("Thời gian bay cập nhật thành công");

    }  catch (error) {
        console.error("Lỗi delay chuyến bay", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {getFlightByID, getFLightByArrival, getFlightByDepartureAndArrival, getFlightByDepartureDate, getAllFlights, getFlightsOneWay, getFlightsRoundTrip, addFlight, updateFlightStatus, updatePrepareFlight, setDelayTime};