const express = require('express');
const {getAllFlights, getFlightsOneWay, getFlightsRoundTrip } = require('../controller/FlightController');

const router = express.Router();

router.post('/allflights', getAllFlights);
router.post('/oneway/:departCity/:arriveCity/:departDate', getFlightsOneWay);
router.post('/roundtrip/:departCity/:arriveCity/:departDate/:arriveDate', getFlightsRoundTrip);

module.exports = router;
