const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    passenger_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    flight_id: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
    booking_date: { type: Date, default: Date.now, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    class_type: { type: String, enum: ['Economy', 'Business'], required: true },
    seat_number: { type: String, required: true },
    total_price: { type: Number, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);