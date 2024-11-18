const express = require('express');
const router = express.Router();
const { login, profile, register, update } = require('../controller/AuthController');
const userVerification = require('../middleware/authMiddleware');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Profile
router.get('/profile', userVerification, profile);

// Update Identification
router.put('/profile', userVerification, update);

// Test Route
router.get('/test', userVerification, async (req, res) => {
    try {
        const userId = req.user.id; // Decoded ID from middleware
        res.json({ message: "Test route works", userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error testing the route" });
    }
});

module.exports = router;