const mongoose = require('mongoose');
const { Schema } = mongoose;

const seatFlightSchema = new Schema({
    class_type: { type: String, enum: ['Economy', 'Business'], required: true },
    seat_count: { type: Number, required: true },
    price: { type: Number, required: true },
});

const flightSchema = new Schema({
    flight_number: { type: String, required: true, unique: true },
    aircraft_id: { type: String, ref: 'Aircraft', required: true },
    departure_airport_id: { type: Schema.Types.ObjectId, ref: 'Airport', required: true },
    arrival_airport_id: { type: Schema.Types.ObjectId, ref: 'Airport', required: true },
    departure_time: { type: Date, required: true },
    arrival_time: { type: Date, required: true },
    available_seats: [seatFlightSchema],
    status: { type: String, enum: ['Scheduled', 'Delayed', 'Cancelled'], required: true },
});

module.exports = mongoose.model('Flight', flightSchema);
