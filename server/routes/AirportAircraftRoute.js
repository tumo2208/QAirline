const express = require('express');
const {allAirports, addAircraft, removeAircraft} = require('../controller/AirportAircraftController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/allAirports', allAirports);
router.post('/addAircraft', userVerification, addAircraft);
router.post('/removeAircraft', userVerification, removeAircraft);

module.exports = router;