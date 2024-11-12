const express = require('express');
const router = express.Router();
const { login, profile, register } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const userVerification = require('../middleware/authMiddleware');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Profile
router.get('/:username/profile', userVerification, profile);

module.exports = router;