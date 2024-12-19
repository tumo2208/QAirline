const express = require('express');
const {getMonthlyRevenue, getTopDestination, getFlightStatistic} = require('../controller/StatisticController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/monthlyRevenue/:year', userVerification, getMonthlyRevenue);
router.post('/topDestination', userVerification, getTopDestination);
router.post('/flightDetail', userVerification, getFlightStatistic);

module.exports = router;