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
            try {
                const user = await User.findById(data.id);
                if (user) {
                    req.user = user; 
                    next();
                } else {
                    return res.status(400).json({ message: "User not found", status: false });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
            }
        }
    });
};

module.exports = userVerification;