const mongoose = require('mongoose');
const { Schema } = mongoose;
const {nationalities} = require('../../client/src/shared/SharedData');

const passengerSchema = new Schema({
    passenger_code: { type: String, required: true },
    type: { type: String, enum: ['Adult', 'Child', 'Infant'] },
    full_name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    adult_details: {
        nationality: { type: String, enum: nationalities },
        phone_code: { type: String },
        phone_number: { type: String },
        email: { type: String },
        id_type: { type: String, enum: ['Citizen ID', 'Passport'] },
        id_number: { type: String }
    },
    infant_details: {
        accompanying_id: { type: String },
    },
});

module.exports = mongoose.model('Passenger', passengerSchema);
