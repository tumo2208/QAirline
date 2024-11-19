const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const {nationalities} = require('../../client/src/shared/SharedData');

const userSchema = new Schema({
    full_name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Others'], required: true },
    dob: { type: Date, required: true },
    nationality: { type: String, enum: nationalities, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 8;
            },
            message: " Password must be at least 8 characters long!"
        }
    },
    phone_number: { 
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 10;
            },
            message: "Phone number must be 10 characters long!"
        }
    },
    id_type: { type: String, enum: ['Citizen ID', 'Passport'] },
    identification_id: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
