const express = require('express');
const {getMyBookings, getBookingByID, makeBooking, cancelBooking, cancelTicket} = require('../controller/BookingController');
const userVerification = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/myBookings', userVerification, getMyBookings);
router.post('/getBookingByID', userVerification, getBookingByID);
router.post('/newBooking', userVerification, makeBooking);
router.post('/cancelBooking', userVerification, cancelBooking);
router.post('/cancelTicket', userVerification, cancelTicket);

module.exports = router;