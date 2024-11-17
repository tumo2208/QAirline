const mongoose = require('mongoose');
const { Schema } = mongoose;

const seatFlightSchema = new Schema({
    class_type: { type: String, enum: ['Economy', 'Business'], required: true },
    seat_count: { type: Number, required: true },
    price: { type: Number, required: true },
});

const flightSchema = new Schema({
    flight_number: { type: String, required: true },
    aircraft_id: { type: Schema.Types.ObjectId, ref: 'Aircraft', required: true },
    departure_airport_id: { type: Schema.Types.ObjectId, ref: 'Airport', required: true },
    arrival_airport_id: { type: Schema.Types.ObjectId, ref: 'Airport', required: true },
    departure_time: { type: Date, required: true },
    arrival_time: { type: Date, required: true },
    available_seats: [seatFlightSchema],
    status: { type: String, enum: ['Scheduled', 'Delayed', 'Cancelled'], required: true },
});

// Temporary
// flightSchema.pre('save', async function (next) {
//     if (!this.isNew) return next();
//
//     const aircraft = await mongoose.model('Aircraft').findById(this.aircraft_id);
//     if (aircraft) {
//         this.available_seats = aircraft.seat_classes.map(seatClass => ({
//             class_type: seatClass.class_type,
//             seat_count: seatClass.seat_count,
//         }));
//     } else {
//         return next(new Error('Aircraft not found for the flight.'));
//     }
//
//     next();
// });

module.exports = mongoose.model('Flight', flightSchema);
