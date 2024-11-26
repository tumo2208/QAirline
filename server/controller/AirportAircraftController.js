const Airport = require('../models/Airport');
const Aircraft = require('../models/Aircraft');

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

module.exports = {allAirports, addAircraft};