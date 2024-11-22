const express = require('express');
const {getMyBookings, makeBooking, cancelBooking, makeTicket} = require('../controller/BookingController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/myBookings', userVerification, getMyBookings);
router.post('/newBooking', userVerification, makeBooking);
router.post('/cancelBooking', userVerification, cancelBooking);
router.post('/makeTicket', makeTicket);

module.exports = router;