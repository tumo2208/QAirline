const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Ticket = require('../models/Ticket');
const Aircraft = require('../models/Aircraft');
const {Adult, Children, Infant} = require('../../client/src/shared/SharedData');
const {ObjectId} = require("mongodb");

/**
 * Function to compute seat no next.
 * @param flight flight that booking
 * @param aircraft aircraft of this flight
 * @param class_type seat class customer want
 * @returns {string} seat no
 */
const determineNextChair = (flight, aircraft, class_type) => {
    const seatClassInfo = aircraft.seat_classes.findOne(seatClass => seatClass.class_type === class_type);
    const seatMax = seatClassInfo.seat_count;

    const allSeats = [];
    if (class_type === 'Economy') {
        for (let i = 0; i < seatMax; ++i) {
            const rowNumber = (i % 6) + 1; // Số hàng (1-6)
            const columnChar = String.fromCharCode(Math.floor(i / 6) + 65); // Ký tự cột (A, B, C,...)
            allSeats.push(`${rowNumber}${columnChar}`);
        }
    } else {
        for (let i = 0; i < seatMax; ++i) {
            const vipNo = i.toString().padStart(2, '0');
            allSeats.push(`VIP${vipNo}`);
        }
    }

    const usedSeats = flight.occupied_seats?.get(class_type) || [];

    const availableSeats = allSeats.filter(seat => !usedSeats.includes(seat));
    return availableSeats[0];
};

const getMyBookings = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(403).json({ error: 'You need to login to view booking history'});
        }
        const allMyBookings = await Booking.find({
            passenger_id: user._id
        });

        if (allMyBookings.length === 0) {
            return res.status(404).json({ status: false, message: "No bookings found" });
        }
        return res.status(200).json(allMyBookings);

    } catch (error) {
        console.error("Error fetching bookings", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

const makeBooking = async (req, res) => {
    try {
        const user = req.user;
        let uid = new ObjectId();
        if (user) {
            uid = user._id;
        }
        const {flightID, numAdult, numChildren, numInfant} = req.body;
        const neededSeats = numChildren + numAdult;
        const flight = await Flight.findOne({
            flight_number: flightID
        });
        let numSeats = 0;
        const availableSeats = flight.available_seats;
        availableSeats.forEach(seatClass => {
            numSeats += seatClass.seat_count;
        });
        if (neededSeats > numSeats) {
            return res.status(400).json({ error: 'No seats available.' });
        }
        const newBooking = new Booking({
            passenger_id: uid,
            flight_id: flightID,
            num_adult: numAdult,
            num_child: numChildren,
            num_infant: numInfant,
            total_price: 0
        });
        await newBooking.save();
        res.status(200).json("Booking was adding, please fill information for each ticket!");
    } catch (error) {
        console.error("Error adding booking", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const makeTicket = async (req, res) => {
    try {
        const { bookingID, adultList, childrenList, infantList } = req.body;
        const booking = await Booking.findById(bookingID);
        let flight = await Flight.findOne({
            flight_number: booking.flight_id
        });
        const aircraft = await Aircraft.findOne({
            aircraft_number: flight.aircraft_id
        });

        const tickets = [];
        let totalPrice = 0;

        const updateOccupiedSeats = async (flightId, classType, seatNumber) => {
            await Flight.updateOne(
                { flight_number: flightId },
                { $push: { [`occupied_seats.${classType}`]: seatNumber } }
            );

            await Flight.updateOne(
                { flight_number: flightId, "available_seats.class_type": classType },
                { $inc: { "available_seats.$.seat_count": -1 } }
            );

            flight = await Flight.findOne({ flight_number: booking.flight_id });
        };

        // Create tickets for adults
        for (const adult of adultList) {
            const adultInfo = new Adult(adult.customer_name, adult.dob, adult.gender,
                adult.nationality, adult.phone_number, adult.email, adult.id_type, adult.id_number,
                adult.country_issuing, adult.date_expiration, adult.address, adult.receive_flight_info);

            const seatClass = flight.available_seats.find(sc => sc.class_type === adult.class_type);
            if (!seatClass || seatClass.seat_count <= 0) {
                throw new Error(`No available seats in ${adult.class_type} class`);
            }

            const seatNumber = determineNextChair(flight, aircraft, adult.class_type);

            const ticket = new Ticket({
                booking_id: booking._id,
                customer_type: "Adult",
                customer_details: adultInfo,
                class_type: adult.class_type,
                seat_number: seatNumber,
                price: seatClass.price,
            });

            await ticket.save();
            tickets.push(ticket);
            totalPrice += seatClass.price;

            await updateOccupiedSeats(booking.flight_id, adult.class_type, seatNumber);
        }

        // Create tickets for children
        for (const child of childrenList) {
            const childInfo = new Children(child.customer_name, child.dob, child.gender);
            const seatClass = flight.available_seats.find(sc => sc.class_type === child.class_type);
            if (!seatClass || seatClass.seat_count <= 0) {
                throw new Error(`No available seats in ${child.class_type} class`);
            }

            const seatNumber = determineNextChair(flight, aircraft, child.class_type);

            const ticket = new Ticket({
                booking_id: booking._id,
                customer_type: "Child",
                customer_details: childInfo,
                class_type: child.class_type,
                seat_number: seatNumber,
                price: seatClass.price,
            });

            await ticket.save();
            tickets.push(ticket);
            totalPrice += seatClass.price;

            await updateOccupiedSeats(booking.flight_id, child.class_type, seatNumber);
        }

        // Create tickets for infants
        for (const infant of infantList) {
            const infantInfo = new Infant(infant.customer_name, infant.dob,
                infant.gender, infant.fly_with);
            const ticket = new Ticket({
                booking_id: booking._id,
                customer_type: "Infant",
                customer_details: infantInfo,
                price: 100000,
            });

            await ticket.save();
            tickets.push(ticket);
            totalPrice += 100000;
        }

        await Booking.findByIdAndUpdate(
            bookingID,
            {
                $push: { tickets: { $each: tickets } },
                $set: { total_price: totalPrice }
            }
        );

        res.status(200).json("Tickets created and added to booking successfully!");
    } catch (error) {
        console.error("Error adding ticket", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        // const user = req.user;
        const { bookingID } = req.body;

        const booking = await Booking.findById(bookingID);
        if (!booking) {
            return res.status(404).json({ status: false, message: "Booking not found" });
        }

        const flight = await Flight.findOne({ flight_number: booking.flight_id });
        if (!flight) {
            return res.status(404).json({ status: false, message: "Flight not found" });
        }

        const tickets = await Ticket.find({ booking_id: bookingID });

        for (const ticket of tickets) {
            await Ticket.findByIdAndDelete(ticket._id);

            if (ticket.customer_type !== 'Infant') {
                await Flight.updateOne(
                    { flight_number: booking.flight_id },
                    { $pull: { [`occupied_seats.${ticket.class_type}`]: ticket.seat_number } }
                );

                await Flight.updateOne(
                    { flight_number: booking.flight_id, "available_seats.class_type": ticket.class_type },
                    { $inc: { "available_seats.$.seat_count": 1 } }
                );
            }
        }

        await Booking.findByIdAndDelete(bookingID);

        res.status(200).json("Booking and tickets cancelled successfully");

    } catch (error) {
        console.error("Error canceling booking", error);
        res.status(500).json({ status: false, message: error.message });
    }
};


module.exports = {getMyBookings, makeBooking, cancelBooking, makeTicket};