const express = require('express');
const router = express.Router();
const { login, profile, register, update, changePassword, logout } = require('../controller/AuthController');
const userVerification = require('../middleware/authMiddleware');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Profile
router.get('/profile', userVerification, profile);

// Update Identification
router.post('/update', userVerification, update);

// Change password
router.post('/change-password', userVerification, changePassword);

// Logout
router.get('/logout', userVerification, logout);

module.exports = router;