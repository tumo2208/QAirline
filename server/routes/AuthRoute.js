const express = require('express');
const router = express.Router();
const { login, profile, register, update, changePassword } = require('../controller/AuthController');
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
router.post('/change-password', userVerification, changePassword);

module.exports = router;