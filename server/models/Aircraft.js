const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatClassSchema = new Schema({
    class_type: { type: String, enum: ['Economy', 'Business'], required: true },
    seat_count: { type: Number, required: true },
});

const aircraftSchema = new Schema({
    aircraft_number: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    seat_number: { type: Number, required: true },
    seat_classes: [seatClassSchema],
});

aircraftSchema.pre('save', function(next) {
    const totalSeats = this.seat_number;
  
    this.seat_classes = [
      { class_type: 'Economy', seat_count: Math.floor(totalSeats * 0.8) },
      { class_type: 'Business', seat_count: Math.floor(totalSeats * 0.2) }
    ];
  
    next();
  });

module.exports = mongoose.model('Aircraft', aircraftSchema);