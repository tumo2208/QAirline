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
          const user = req.user;
          if (user.user_type !== 'Admin') {
              return res.status(404).json({error: 'Bạn không có thẩm quyền để sử dung chức năng này'});
          }

          const {aircraftNumber, manufacturer, seatNumber} = req.body;
          const newAircraft = new Aircraft({
              aircraft_number: aircraftNumber,
              manufacturer: manufacturer,
              seat_number: seatNumber,
          });
          await newAircraft.save();
          res.status(200).json("Máy bay tạo thành công!");
      } catch (err) {
          console.error("Lỗi thêm máy bay", err);
          return res.status(500).json({ status: false, message: err.message });
      }
};

const removeAircraft = async (req, res) => {
    try {
        const user = req.user;
        if (user.user_type !== 'Admin') {
            return res.status(404).json({error: 'Bạn không có thẩm quyền để sử dung chức năng này'});
        }

        const {aircraftID} = req.body;
        const flights = await Flight.find({
            aircraft_id: aircraftID,
            status: 'Scheduled'
        });

        if (flights.length > 0) {
            return res.status(404).json({ error: 'Không thể xóa máy bay đang có lịch bay!'});
        }

        await Aircraft.findOneAndDelete({
            aircraft_number: aircraftID
        });

    }  catch (err) {
        console.error("Lỗi khi xóa máy bay", err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {allAirports, addAircraft, removeAircraft};