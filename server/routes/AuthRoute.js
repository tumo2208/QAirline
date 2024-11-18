const express = require('express');
const router = express.Router();
const { login, profile, register, updateIdentification } = require('../controller/AuthController');
const userVerification = require('../middleware/authMiddleware');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Profile
router.get('/profile', userVerification, profile);

// Update Identification
router.put('/profile/identification', userVerification, updateIdentification);

module.exports = router;