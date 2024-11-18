const mongoose = require('mongoose');
const { Schema } = mongoose;

const Ticket = require('./Ticket');

const bookingSchema = new Schema({
    booking_id: { type: String, required: true },
    book_user_id: { type: String, ref: 'User', required: true },
    tickets: [Ticket.schema],
    booking_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
