const mongoose = require('mongoose');
const { Schema } = mongoose;

// const AdultSchema = new Schema({
//     customer_name: {type: String, required: true},
//     dob: {type: Date, required: true},
//     gender: { type: String, enum: ['Male', 'Female', 'Others'], required: true },
//     nationality: {type: String, required: true},
//     phone_number: {type: String, required: true},
//     email: {type: String, required: true},
//     id_type: {type: String, enum: ['Citizen Identification', 'Passport'], required: true},
//     id_number: {type: String, required: true},
//     country_issuing: {type: String, required: true},
//     date_expiration: {type: Date, required: true},
//     address: {type: String},
//     receive_flight_info: {type: String, enum: ['none', 'SMS', 'mail']},
// });
//
// const ChildrenSchema = new Schema({
//     customer_name: {type: String, required: true},
//     dob: {type: Date, required: true},
//     gender: { type: String, enum: ['Male', 'Female', 'Others'], required: true },
// });
//
// const InfantSchema = new Schema({
//     customer_name: {type: String, required: true},
//     dob: {type: Date, required: true},
//     gender: { type: String, enum: ['Male', 'Female', 'Others'], required: true },
//     fly_with: {type: String, required: true},
// });

const ticketSchema = new Schema({
    booking_id: {type: Schema.Types.ObjectId, required: true},
    customer_type: { type: String, enum: ['Adult', 'Child', 'Infant'], required: true },
    customer_details: {
        type: Schema.Types.Mixed,
        required: true
    },
    class_type: { type: String, enum: ['Economy', 'Business'], required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Ticket', ticketSchema);