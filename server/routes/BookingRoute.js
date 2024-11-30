const express = require('express');
const {getMyBookings, makeBooking, cancelBooking} = require('../controller/BookingController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/myBookings', userVerification, getMyBookings);
router.post('/newBooking', userVerification, makeBooking);
router.post('/cancelBooking', userVerification, cancelBooking);

module.exports = router;