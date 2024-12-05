const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");
require("dotenv").config();

const userVerification = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        // return res.status(400).json({ message: "No token, authorization denied" });
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is blacklisted
        const blacklisted = await redisClient.SISMEMBER("blacklisted_token", token);
        if (blacklisted) {
            req.user = null;
            return next();
            // return res.status(400).json({ message: "Token has been blacklisted, please login again" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            // return res.status(400).json({ message: "User not found" });
            req.user = null;
        }
        req.user = user;
        // next();
    } catch (error) {
        console.error(error);
        // return res.status(500).json({ message: "Server error" });
        req.user = null;
    }

    return next();

};

module.exports = userVerification;