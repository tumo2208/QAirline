const mongoose = require('mongoose');
const { Schema } = mongoose;

const Ticket = require('./Ticket');

const bookingSchema = new Schema({
    flight_id: { type: String, ref: 'Flight', required: true },
    passenger_id: { type: String, ref: 'User', required: true },
    booking_date: { type: Date, default: Date.now },
    num_adult: { type: Number, required: true },
    num_child: { type: Number, required: true },
    num_infant: { type: Number, required: true },
    tickets: [Ticket.schema],
    total_price: { type: Number, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);