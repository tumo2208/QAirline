const express = require('express');
const {getFlightByID, getAllFlights, getFlightsOneWay, getFlightsRoundTrip, addFlight, setDelayTime } = require('../controller/FlightController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/getFlightByID', getFlightByID)
router.get('/allflights', getAllFlights);
router.post('/oneway', getFlightsOneWay);
router.post('/roundtrip', getFlightsRoundTrip);
router.post('/addflight', userVerification, addFlight);
router.post('/setDelayTime', userVerification, setDelayTime);

module.exports = router;
