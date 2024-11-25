const express = require('express');
const {allAirports, addAircraft} = require('../controller/AirportAircraftController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/allAirports', allAirports);
router.post('/addAircraft', userVerification, addAircraft);

module.exports = router;