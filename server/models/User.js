const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    full_name: { type: String, required: true },
    password: { type: String, required: true }, // Needs hashing
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    age: { type: Number, required: true },
    nationality: { type: String, required: true },
    email: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
