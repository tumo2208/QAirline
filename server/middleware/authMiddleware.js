const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userVerification = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) {
            return res.status(400).json({ message: "Token is not valid" });
        } else {
            const user = await User.findById(data.id);
            if (user) {
                return res.status(200).json({ 
                    message: "User is verified", 
                    user: {
                        full_name: user.full_name,
                        email: user.email,
                        gender: user.gender,
                        age: user.age,
                        nationality: user.nationality,
                        dob: user.dob,
                        phone_number: user.phone_number,
                        identification_id: user.identification_id,
                        id_type: user.id_type,
                        created_at: user.created_at
                    }
                });
            } else {
                return res.status(400).json({ message: "User not found", status: false });
            }
        }
    })
};

module.exports = userVerification;