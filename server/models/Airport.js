const mongoose = require('mongoose');
const { Schema } = mongoose;

const airportSchema = new Schema({
    airport_code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    is_international: { type: Boolean, default: false },
});

module.exports = mongoose.model('Airport', airportSchema);
