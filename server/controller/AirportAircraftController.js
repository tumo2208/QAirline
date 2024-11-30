const Airport = require('../models/Airport');
const Aircraft = require('../models/Aircraft');
const Flight = require('../models/Flight');

const allAirports = async (req, res) => {
    try {
        const airports = await Airport.find();
        res.status(200).json(airports);
    }  catch (err) {
        console.error("Error fetching airports", err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const addAircraft = async (req, res) => {
      try {
          const {aircraftNumber, manufacturer, seatNumber} = req.body;
          const newAircraft = new Aircraft({
              aircraft_number: aircraftNumber,
              manufacturer: manufacturer,
              seat_number: seatNumber,
          });
          await newAircraft.save();
          res.status(200).json("Aircraft added successfully");
      } catch (err) {
          console.error("Error adding aircraft", err);
          return res.status(500).json({ status: false, message: err.message });
      }
};

const removeAircraft = async (req, res) => {
    try {
        const {aircraftID} = req.body;
        const flights = await Flight.find({
            aircraft_id: aircraftID,
            status: 'Scheduled'
        });

        if (flights.length > 0) {
            return res.status(404).json({ error: 'Cant remove this aircraft because some flight use it'});
        }

        await Aircraft.findOneAndDelete({
            aircraft_number: aircraftID
        });

    }  catch (err) {
        console.error("Error removing aircraft", err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {allAirports, addAircraft, removeAircraft};