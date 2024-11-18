const mongoose = require('mongoose');
const { Schema } = mongoose;

const airportSchema = new Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    airport_code: { type: String, required: true, unique: true },
    isInternational: { type: Boolean, default: false },
});

module.exports = mongoose.model('Airport', airportSchema);
