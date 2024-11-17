const express = require('express');
const {getAllFlights, getFlightsOneWay, getFlightsRoundTrip, addFlight } = require('../controller/FlightController');

const router = express.Router();

router.get('/allflights', getAllFlights);
router.get('/oneway', getFlightsOneWay);
router.get('/roundtrip', getFlightsRoundTrip);
router.post('/addflight', addFlight);

module.exports = router;
