const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Airport = require('../models/Airport');
const Aircraft = require('../models/Aircraft');

const getMonthlyRevenue = async (req, res) => {
    const year = parseInt(req.params.year);
    const user = req.user;
    if (user.user_type !== 'Admin') {
        return res.status(404).json({error: 'Bạn không có quyền để sử dụng chức năng này!'});
    }
    try {
        const data = await Booking.aggregate([
            {
                $match: {
                    booking_date: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`),
                    },
                },
            },
            {
                $group: {
                    _id: {$month: "$booking_date"},
                    totalRevenue: {$sum: "$total_price"},
                },
            },
            {$sort: {_id: 1}},
        ]);

        const monthlyData = Array.from({length: 12}, (_, i) => ({
            month: i + 1,
            totalRevenue: 0,
        }));
        data.forEach(({_id, totalRevenue}) => {
            monthlyData[_id - 1].totalRevenue = totalRevenue;
        });

        return res.status(200).json(monthlyData);
    } catch (err) {
        console.error("Error getting monthly revenue", err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const getTopDestination = async (req, res) => {
    try {
        const { month, year } = req.body;

        const user = req.user;
        if (user.user_type !== 'Admin') {
            return res.status(404).json({error: 'Bạn không có quyền để sử dụng chức năng này!'});
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const topDestinations = await Flight.aggregate([
            // Join với Aircraft để lấy số lượng ghế
            {
                $lookup: {
                    from: 'aircrafts',
                    localField: 'aircraft_id',
                    foreignField: 'aircraft_number',
                    as: 'aircraftDetails',
                },
            },
            {
                $unwind: '$aircraftDetails',
            },
            // Tính tổng số ghế trên máy bay
            {
                $addFields: {
                    totalSeats: {
                        $sum: '$aircraftDetails.seat_classes.seat_count',
                    },
                },
            },
            // Tính số hành khách trên chuyến bay
            {
                $addFields: {
                    passengers: {
                        $subtract: ['$totalSeats', { $sum: '$available_seats.seat_count' }],
                    },
                },
            },
            // Lọc theo tháng/năm của ngày bay
            {
                $match: {
                    departure_time: { $gte: startDate, $lte: endDate },
                },
            },
            // Tính tổng số hành khách theo sân bay đến
            {
                $group: {
                    _id: '$arrival_airport_id',
                    totalPassengers: { $sum: '$passengers' },
                },
            },
            // Join với bảng Airport để lấy thông tin chi tiết của sân bay
            {
                $lookup: {
                    from: 'airports',
                    localField: '_id',
                    foreignField: 'airport_code',
                    as: 'airportDetails',
                },
            },
            {
                $unwind: '$airportDetails',
            },
            {
                $project: {
                    _id: 0,
                    city: '$airportDetails.city',
                    totalPassengers: 1,
                },
            },
            {
                $sort: { totalPassengers: -1 },
            },
            { $limit: 3 },
        ]);

        res.status(200).json(topDestinations);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
}

const getFlightStatistic = async (req, res) => {
    try {
        const user = req.user;
        if (user.user_type !== 'Admin') {
            return res.status(404).json({error: 'Bạn không có quyền để sử dụng chức năng này!'});
        }
        const { flightID } = req.body;
        const flight = await Flight.findOne({
            flight_number: flightID
        });

        const departureAirport = await Airport.findOne({
            airport_code: flight.departure_airport_id,
        });
        const arrivalAirport = await Airport.findOne({
            airport_code: flight.arrival_airport_id,
        });
        const departureCity = departureAirport.city;
        const arrivalCity = arrivalAirport.city;

        const aircraft = await Aircraft.findOne({
            aircraft_number: flight.aircraft_id
        });
        let economySeats, businessSeats;
        aircraft.seat_classes.map((seatClass) => {
            if (seatClass.class_type === 'Business') businessSeats = seatClass.seat_count;
            else economySeats = seatClass.seat_count;
        });

        let availableEconomySeats, availableBusinessSeats;
        flight.available_seats.map((seatClass) => {
            if (seatClass.class_type === 'Business') availableBusinessSeats = seatClass.seat_count;
            else availableEconomySeats = seatClass.seat_count;
        })

        const flightDetail = {
            flight_number: flightID,
            departure_time: flight.departure_time,
            arrival_time: flight.arrival_time,
            departure_city: departureCity,
            arrival_city: arrivalCity,
            economySeats: economySeats,
            businessSeats: businessSeats,
            economyPassengers: economySeats - availableEconomySeats,
            businessPassengers: businessSeats - availableBusinessSeats,
        }

        return res.status(200).json(flightDetail);
    } catch (err) {
        console.error('Error getting flight details: ',err);
        return res.status(500).json({ status: false, message: err.message });
    }
}

module.exports = {getMonthlyRevenue, getTopDestination, getFlightStatistic};