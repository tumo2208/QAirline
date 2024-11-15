const express = require('express');
const router = express.Router();
const { login, profile, register } = require('../controller/AuthController');
const userVerification = require('../middleware/authMiddleware');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Profile
router.get('/profile', userVerification, profile);

module.exports = router;