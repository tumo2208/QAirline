const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Ticket = require('../models/Ticket');
const Aircraft = require('../models/Aircraft');
const {Adult, Children, Infant, determineNextChair} = require('../../client/src/shared/SharedData');

const getMyBookings = async (req, res) => {
    try {
        const user = req.user;
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
        const {flightID, numAdult, numChildren, numInfant} = req.body;
        const neededSeats = numChildren + numInfant + numAdult;
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
            passenger_id: user._id,
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

        const updateSeatCount = async (flightId, classType) => {
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

            const ticket = new Ticket({
                booking_id: booking._id,
                customer_type: "Adult",
                customer_details: adultInfo,
                class_type: adult.class_type,
                seat_number: determineNextChair(flight, aircraft, adult.class_type),
                price: seatClass.price,
            });
            await ticket.save();
            tickets.push(ticket);
            totalPrice += seatClass.price;
            await updateSeatCount(booking.flight_id, adult.class_type);
        }

        // Create tickets for children
        for (const child of childrenList) {
            const childInfo = new Children(child.customer_name, child.dob, child.gender);
            const seatClass = flight.available_seats.find(sc => sc.class_type === child.class_type);
            if (!seatClass || seatClass.seat_count <= 0) {
                throw new Error(`No available seats in ${child.class_type} class`);
            }

            const ticket = new Ticket({
                booking_id: booking._id,
                customer_type: "Child",
                customer_details: childInfo,
                class_type: child.class_type,
                seat_number: determineNextChair(flight, aircraft, child.class_type),
                price: seatClass.price,
            });
            await ticket.save();
            tickets.push(ticket);
            totalPrice += seatClass.price;
            await updateSeatCount(booking.flight_id, child.class_type);
        }

        // Create tickets for infants
        for (const infant of infantList) {
            const infantInfo = new Infant(infant.customer_name, infant.dob,
                infant.gender, infant.fly_with);
            const seatClass = flight.available_seats.find(sc => sc.class_type === infant.class_type);
            if (!seatClass || seatClass.seat_count <= 0) {
                throw new Error(`No available seats in ${infant.class_type} class`);
            }

            const ticket = new Ticket({
                booking_id: booking._id,
                customer_type: "Infant",
                customer_details: infantInfo,
                class_type: infant.class_type,
                seat_number: determineNextChair(flight, aircraft, infant.class_type),
                price: seatClass.price,
            });
            await ticket.save();
            tickets.push(ticket);
            totalPrice += seatClass.price;
            await updateSeatCount(booking.flight_id, infant.class_type);
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
        const user = req.user;
        const { bookingID } = req.body;

        const booking = await Booking.findById(bookingID);

        if (!booking) {
            return res.status(404).json({ status: false, message: "Booking not found" });
        }

        const tickets = booking.tickets;

        for (const ticket of tickets) {
            await Ticket.findByIdAndDelete(ticket._id);

            const flight = await Flight.findOne({ flight_number: booking.flight_id });
            const seatClass = flight.available_seats.find(sc => sc.class_type === ticket.class_type);
            if (seatClass) {
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