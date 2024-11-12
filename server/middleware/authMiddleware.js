const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userVerification = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found." });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ status: false, message: "Invalid token." });
    }
};

module.exports = userVerification;