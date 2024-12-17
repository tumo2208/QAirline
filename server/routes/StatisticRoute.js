const express = require('express');
const {getMonthlyRevenue} = require('../controller/StatisticController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/monthlyRevenue/:year', userVerification, getMonthlyRevenue);

module.exports = router;