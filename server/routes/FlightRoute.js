const express = require('express');
const {getAllFlights, getFlightsOneWay, getFlightsRoundTrip, addFlight } = require('../controller/FlightController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/allflights', getAllFlights);
router.post('/oneway', getFlightsOneWay);
router.post('/roundtrip', getFlightsRoundTrip);
router.post('/addflight', userVerification, addFlight);

module.exports = router;
