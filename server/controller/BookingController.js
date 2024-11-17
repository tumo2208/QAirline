const Booking = require('../models/Booking');
const Flight = require('../models/Flight');


const getMyBookings = async (req, res) => {
    try {
        const user = req.user;
        const allMyBookings = await Booking.find({
            passenger_id: user._id
        });

        if (allMyBookings.length === 0) {
            return res.status(404).json({ status: false, message: "No bookings found" });
        }
        return res.status(200).json(allMyBookings);

    } catch (error) {
        console.error("Error fetching bookings", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

const makeBooking = async (req, res) => {
    // try {
    //     const user = req.user;
    //     const {flightID, classType} = req.body;
    //     const flight = await Flight.find({
    //         flight_number: flightID
    //     })
    //     const seat = flight.available_seats.find(seat => seat.class_type === classType);
    //     const newBooking = new Booking({
    //         passenger_id: user._id,
    //         flight_id: flightID,
    //         class_type: classType,
    //         total_price: seat.price
    //     });
    // } catch (error) {
    //
    // }
};

const cancelBooking = async (req, res) => {

};

module.exports = {getMyBookings, makeBooking, cancelBooking};