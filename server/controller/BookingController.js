const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Ticket = require('../models/Ticket');
const Aircraft = require('../models/Aircraft');
const {Adult, Children, Infant} = require('../shared/SharedData');

const {ObjectId} = require("mongodb");

/**
 * Function to compute seat no next.
 * @param flight flight that booking
 * @param aircraft aircraft of this flight
 * @param class_type seat class customer want
 * @returns {string} seat no
 */
const determineNextChair = (flight, aircraft, class_type) => {
    const seatClassInfo = aircraft.seat_classes.find(seatClass => seatClass.class_type === class_type);
    const seatMax = seatClassInfo.seat_count;

    const allSeats = [];
    if (class_type === 'Economy') {
        for (let i = 0; i < seatMax; ++i) {
            const rowNumber = (i % 6) + 1; // Số hàng (1-6)
            const columnChar = String.fromCharCode(Math.floor(i / 6) + 65);
            allSeats.push(`${rowNumber}${columnChar}`);
        }
    } else {
        for (let i = 1; i <= seatMax; ++i) {
            const vipNo = i.toString().padStart(2, '0');
            allSeats.push(`VIP${vipNo}`);
        }
    }

    const usedSeats = flight.occupied_seats?.get(class_type) || [];

    const availableSeats = allSeats.filter(seat => !usedSeats.includes(seat));
    return availableSeats[0];
};

/**
 * Function to generate Booking ID randomly.
 * @returns {string}
 */
function generateBookingID() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let bookingID = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        bookingID += characters.charAt(randomIndex);
    }

    return bookingID;
}

const getMyBookings = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(403).json({ error: 'Bạn cần đăng nhập để xem thông tin đặt vé' });
        }
        const allMyBookings = await Booking.find({
            passenger_id: user._id
        });

        if (allMyBookings.length === 0) {
            return res.status(404).json({ status: false, message: "Không tìm thấy lịch sử đặt chuyến bay" });
        }
        return res.status(200).json(allMyBookings);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách đặt chuyến bay", error);
        return res.status(500).json({ status: false, message: error.message });
    }
};

const getBookingByID = async (req, res) => {
    try {
        const {bookingID} = req.body;
        const booking = await Booking.findOne({
            booking_id: bookingID
        });
        return res.status(200).json(booking);
    }  catch (error) {
        console.error("Lỗi xem thông tin đặt chuyến bay", error);
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
        const {outboundFlightID, numAdult, numChildren, numInfant, classType, adultList, childrenList, infantList} = req.body;
        let flight = await Flight.findOne({
            flight_number: outboundFlightID
        });
        const aircraft = await Aircraft.findOne({
            aircraft_number: flight.aircraft_id
        });

        // Handle log error when out of seats
        const neededSeats = numChildren + numAdult;
        const seatClass = flight.available_seats.find(sc => sc.class_type === classType);
        const price = seatClass.price;
        if (seatClass.seat_count < neededSeats) {
            return res.status(404).json({ error: 'Hết chỗ'});
        }

        // Create Booking
        const newBooking = new Booking({
            passenger_id: uid,
            flight_id: outboundFlightID,
            class_type: classType,
            num_adult: numAdult,
            num_child: numChildren,
            num_infant: numInfant,
            total_price: 0
        });

        // Gen Booking ID
        const objectIDString = newBooking._id.toString();
        let bookingID = objectIDString.slice(-6);
        let duplicateBookingID = await Booking.findOne({
            booking_id: bookingID
        });
        while (duplicateBookingID) {
            bookingID = generateBookingID();
            duplicateBookingID = await Booking.findOne({
                booking_id: bookingID
            });
        }
        newBooking.booking_id = bookingID;

        await newBooking.save();

        // Initial data
        const tickets = [];
        let totalPrice = 0;

        // Function to update list occupiedSeats and availableSeats
        const updateOccupiedSeats = async (outboundFlightID, classType, seatNumber) => {
            await Flight.updateOne(
                { flight_number: outboundFlightID },
                { $push: { [`occupied_seats.${classType}`]: seatNumber } }
            );

            await Flight.updateOne(
                { flight_number: outboundFlightID, "available_seats.class_type": classType },
                { $inc: { "available_seats.$.seat_count": -1 } }
            );

            flight = await Flight.findOne({ flight_number: outboundFlightID });
        };

        // Function to handle ticket creation
        const createTicket = async (customer, type) => {
            const seatNumber = determineNextChair(flight, aircraft, classType);
            const ticket = new Ticket({
                booking_id: bookingID,
                customer_type: type,
                customer_details: customer,
                class_type: classType,
                seat_number: seatNumber,
                price: price
            });

            await ticket.save();
            tickets.push(ticket);
            totalPrice += price;

            await updateOccupiedSeats(outboundFlightID, classType, seatNumber);
        };

        // Create tickets for adults
        if (Array.isArray(adultList)) {
            for (const adult of adultList) {
                const adultInfo = new Adult(
                    adult.customer_name,
                    adult.dob,
                    adult.gender,
                    adult.nationality,
                    adult.phone_number,
                    adult.email,
                    adult.id_type,
                    adult.id_number,
                    adult.country_issuing,
                    adult.date_expiration,
                    // adult.address,
                    // adult.receive_flight_info
                );
                await createTicket(adultInfo, "Adult");
            }
        }

        // Create tickets for children
        if (Array.isArray(childrenList)) {
            for (const child of childrenList) {
                const childInfo = new Children(child.customer_name, child.dob, child.gender);
                await createTicket(childInfo, "Child");
            }
        }

        // Create tickets for infants
        if (Array.isArray(infantList)) {
            for (const infant of infantList) {
                const infantInfo = new Infant(
                    infant.customer_name,
                    infant.dob,
                    infant.gender,
                    infant.fly_with
                );
                const ticket = new Ticket({
                    booking_id: bookingID,
                    customer_type: "Infant",
                    customer_details: infantInfo,
                    price: price * 0.1,
                });

                await ticket.save();
                tickets.push(ticket);
                totalPrice += (price * 0.1);
            }
        }

        const { returnFlightID } = req.body;
        const returnTickets = [];
        if (returnFlightID) {
            const {returnClassType} = req.body;
            await Booking.findOneAndUpdate(
                { booking_id: bookingID },
                {
                    $set: {
                        return_flight_id: returnFlightID,
                        return_class_type: returnClassType
                    }

                }
            );

            let returnFlight = await Flight.findOne({
                flight_number: returnFlightID
            });
            const returnAircraft = await Aircraft.findOne({
                aircraft_number: returnFlight.aircraft_id
            });

            // Handle log error when out of seats
            const neededSeats = numChildren + numAdult;
            const returnSeatClass = returnFlight.available_seats.find(sc => sc.class_type === returnClassType);
            const returnPrice = returnSeatClass.price;
            if (seatClass.seat_count < neededSeats) {
                return res.status(404).json({ error: 'Hết chỗ'});
            }

            // Function to update list occupiedSeats and availableSeats
            const updateOccupiedSeatsReturn = async (flightId, classType, seatNumber) => {
                await Flight.updateOne(
                    { flight_number: flightId },
                    { $push: { [`occupied_seats.${classType}`]: seatNumber } }
                );

                await Flight.updateOne(
                    { flight_number: flightId, "available_seats.class_type": classType },
                    { $inc: { "available_seats.$.seat_count": -1 } }
                );

                returnFlight = await Flight.findOne({ flight_number: flightId });
            };

            // Function to handle ticket creation
            const createTicketReturn = async (customer, type) => {
                const seatNumber = determineNextChair(returnFlight, returnAircraft, returnClassType);
                const ticket = new Ticket({
                    booking_id: bookingID,
                    customer_type: type,
                    customer_details: customer,
                    class_type: returnClassType,
                    seat_number: seatNumber,
                    price: returnPrice
                });

                await ticket.save();
                returnTickets.push(ticket);
                totalPrice += returnPrice;

                await updateOccupiedSeatsReturn(returnFlightID, returnClassType, seatNumber);
            };

            // Create tickets for adults
            if (Array.isArray(adultList)) {
                for (const adult of adultList) {
                    const adultInfo = new Adult(
                        adult.customer_name,
                        adult.dob,
                        adult.gender,
                        adult.nationality,
                        adult.phone_number,
                        adult.email,
                        adult.id_type,
                        adult.id_number,
                        adult.country_issuing,
                        adult.date_expiration,
                        // adult.address,
                        // adult.receive_flight_info
                    );
                    await createTicketReturn(adultInfo, "Adult");
                }
            }

            // Create tickets for children
            if (Array.isArray(childrenList)) {
                for (const child of childrenList) {
                    const childInfo = new Children(child.customer_name, child.dob, child.gender);
                    await createTicketReturn(childInfo, "Child");
                }
            }

            // Create tickets for infants
            if (Array.isArray(infantList)) {
                for (const infant of infantList) {
                    const infantInfo = new Infant(
                        infant.customer_name,
                        infant.dob,
                        infant.gender,
                        infant.fly_with
                    );
                    const ticket = new Ticket({
                        booking_id: bookingID,
                        customer_type: "Infant",
                        customer_details: infantInfo,
                        price: returnPrice * 0.1,
                    });

                    await ticket.save();
                    returnTickets.push(ticket);
                    totalPrice += (returnPrice * 0.1);
                }
            }
        }

        // Update booking with tickets and total price
        await Booking.findOneAndUpdate(
            { booking_id: bookingID },
            {
                $push: {
                    outbound_tickets: { $each: tickets },
                    return_tickets: { $each: returnTickets }
                },
                $set: { total_price: totalPrice }
            }
        );

        res.status(200).json({bookingID: bookingID});
    } catch (error) {
        console.error("Error adding booking", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

// const makeTicket = async (req, res) => {
//     try {
//         const { bookingID, adultList, childrenList, infantList } = req.body;
//         const booking = await Booking.findById(bookingID);
//         let flight = await Flight.findOne({
//             flight_number: booking.flight_id
//         });
//         const aircraft = await Aircraft.findOne({
//             aircraft_number: flight.aircraft_id
//         });
//
//         const tickets = [];
//         let totalPrice = 0;
//
//         const updateOccupiedSeats = async (flightId, classType, seatNumber) => {
//             await Flight.updateOne(
//                 { flight_number: flightId },
//                 { $push: { [`occupied_seats.${classType}`]: seatNumber } }
//             );
//
//             await Flight.updateOne(
//                 { flight_number: flightId, "available_seats.class_type": classType },
//                 { $inc: { "available_seats.$.seat_count": -1 } }
//             );
//
//             flight = await Flight.findOne({ flight_number: booking.flight_id });
//         };
//
//         // Create tickets for adults
//         for (const adult of adultList) {
//             const adultInfo = new Adult(adult.customer_name, adult.dob, adult.gender,
//                 adult.nationality, adult.phone_number, adult.email, adult.id_type, adult.id_number,
//                 adult.country_issuing, adult.date_expiration, adult.address, adult.receive_flight_info);
//
//             const seatClass = flight.available_seats.find(sc => sc.class_type === adult.class_type);
//             if (!seatClass || seatClass.seat_count <= 0) {
//                 throw new Error(`No available seats in ${adult.class_type} class`);
//             }
//
//             const seatNumber = determineNextChair(flight, aircraft, adult.class_type);
//
//             const ticket = new Ticket({
//                 booking_id: booking._id,
//                 customer_type: "Adult",
//                 customer_details: adultInfo,
//                 class_type: adult.class_type,
//                 seat_number: seatNumber,
//                 price: seatClass.price,
//             });
//
//             await ticket.save();
//             tickets.push(ticket);
//             totalPrice += seatClass.price;
//
//             await updateOccupiedSeats(booking.flight_id, adult.class_type, seatNumber);
//         }
//
//         // Create tickets for children
//         for (const child of childrenList) {
//             const childInfo = new Children(child.customer_name, child.dob, child.gender);
//             const seatClass = flight.available_seats.find(sc => sc.class_type === child.class_type);
//             if (!seatClass || seatClass.seat_count <= 0) {
//                 throw new Error(`No available seats in ${child.class_type} class`);
//             }
//
//             const seatNumber = determineNextChair(flight, aircraft, child.class_type);
//
//             const ticket = new Ticket({
//                 booking_id: booking._id,
//                 customer_type: "Child",
//                 customer_details: childInfo,
//                 class_type: child.class_type,
//                 seat_number: seatNumber,
//                 price: seatClass.price,
//             });
//
//             await ticket.save();
//             tickets.push(ticket);
//             totalPrice += seatClass.price;
//
//             await updateOccupiedSeats(booking.flight_id, child.class_type, seatNumber);
//         }
//
//         // Create tickets for infants
//         for (const infant of infantList) {
//             const infantInfo = new Infant(infant.customer_name, infant.dob,
//                 infant.gender, infant.fly_with);
//             const ticket = new Ticket({
//                 booking_id: booking._id,
//                 customer_type: "Infant",
//                 customer_details: infantInfo,
//                 price: 100000,
//             });
//
//             await ticket.save();
//             tickets.push(ticket);
//             totalPrice += 100000;
//         }
//
//         await Booking.findByIdAndUpdate(
//             bookingID,
//             {
//                 $push: { tickets: { $each: tickets } },
//                 $set: { total_price: totalPrice }
//             }
//         );
//
//         res.status(200).json("Tickets created and added to booking successfully!");
//     } catch (error) {
//         console.error("Error adding ticket", error);
//         res.status(500).json({ status: false, message: error.message });
//     }
// };

/**
 * Function to check time customer cancel ticket or booking is 7 days before flight time or not
 * @param flight flight
 * @returns {boolean}
 */
function checkTimeToCancel (flight) {
    const departTime = new Date(flight.departure_time);
    const currentTime = new Date();
    const cancellationDeadline = new Date(departTime);
    cancellationDeadline.setDate(cancellationDeadline.getDate() - 7);

    return cancellationDeadline > currentTime;
}

const cancelBooking = async (req, res) => {
    try {
        const { bookingID } = req.body;

        const booking = await Booking.findOne({
            booking_id: bookingID
        });

        const flight = await Flight.findOne({
            flight_number: booking.flight_id
        });

        if (!checkTimeToCancel(flight)) {
            return res.status(404).json("Vé chỉ có thể được hủy ít nhất 7 ngày trước khi máy bay cất cánh!");
        }

        const tickets = await Ticket.find({ booking_id: bookingID });

        for (const ticket of tickets) {
            await Ticket.findByIdAndDelete(ticket._id);

            if (ticket.customer_type !== 'Infant') {
                await Flight.updateOne(
                    { flight_number: booking.flight_id },
                    { $pull: { [`occupied_seats.${booking.class_type}`]: ticket.seat_number } }
                );

                await Flight.updateOne(
                    { flight_number: booking.flight_id, "available_seats.class_type": booking.class_type },
                    { $inc: { "available_seats.$.seat_count": 1 } }
                );
            }
        }

        await Booking.findOneAndDelete({
            booking_id: bookingID
        });

        res.status(200).json("Hủy chuyến bay và vé thành công!");

    } catch (error) {
        console.error("Lỗi khi hủy chuyến bay", error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const cancelTicket = async (req, res) => {
    try {
        const { ticketID, confirmation } = req.body;
        let trueConfirm = false;

        const ticket = await Ticket.findById(ticketID);
        const bookingID = ticket.booking_id;
        const booking = await Booking.findOne({
            booking_id: bookingID
        });

        const customerType = ticket.customer_type;

        if (customerType === 'Adult') {
            if (confirmation === ticket.customer_details.id_number) trueConfirm = true;
        } else {
            const [day, month, year] = confirmation.split("/");
            const inputDate = `${year}-${month}-${day}`;
            if (inputDate === ticket.customer_details.dob) trueConfirm = true;
        }

        if (trueConfirm) {
            const ticketPrice = ticket.price;

            const flight = await Flight.findOne({
                flight_number: booking.flight_id
            });

            if (!checkTimeToCancel(flight)) {
                return res.status(404).json("Vé chỉ có thể được hủy ít nhất 7 ngày trước khi máy bay cất cánh!");
            }

            if (customerType === 'Adult') {
                const num_adult = booking.num_adult;
                const num_child = booking.num_child;
                const num_infant = booking.num_infant;
                if ((num_adult === 1 && (num_child > 0 || num_infant > 0)) || (num_adult === num_infant)) {
                    return res.status(403).json("Vi phạm quy tắc đặt vé");
                }
            }

            if (ticket.customer_type !== 'Infant') {
                await Flight.updateOne(
                    { flight_number: booking.flight_id },
                    { $pull: { [`occupied_seats.${booking.class_type}`]: ticket.seat_number } }
                );

                await Flight.updateOne(
                    { flight_number: booking.flight_id, "available_seats.class_type": booking.class_type },
                    { $inc: { "available_seats.$.seat_count": 1 } }
                );
            }

            booking.total_price = booking.total_price - ticketPrice;
            switch (customerType) {
                case 'Adult':
                    booking.num_adult = booking.num_adult - 1;
                    break;
                case 'Child':
                    booking.num_child = booking.num_child - 1;
                    break;
                default:
                    booking.num_infant = booking.num_infant - 1;
                    break;
            }
            booking.outbound_tickets = booking.outbound_tickets.filter(t => t._id.toString() !== ticketID);
            booking.return_tickets = booking.return_tickets.filter(t => t._id.toString() !== ticketID);

            if (booking.outbound_tickets.length === 0 && booking.return_tickets.length === 0) {
                await Booking.findOneAndDelete({
                    booking_id: bookingID
                });
                await Ticket.findByIdAndDelete(ticketID);
                res.status(200).json({newBooking: null });
            } else {
                await booking.save();
                await Ticket.findByIdAndDelete(ticketID);
                res.status(200).json({newBooking: booking });
            }
        } else {
            return res.status(401).json("Mã xác nhận không hợp lệ");
        }
        
    } catch (err) {
        console.error("Lỗi khi hủy vé", err);
        res.status(500).json({ status: false, message: err.message });
    }
};


module.exports = {getMyBookings, getBookingByID, makeBooking, cancelBooking, cancelTicket};