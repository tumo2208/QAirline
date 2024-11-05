const mongoose = require('mongoose');
const { Schema } = mongoose;

const airportSchema = new Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    continent: { type: String, required: true }
});

module.exports = mongoose.model('Airport', airportSchema);
