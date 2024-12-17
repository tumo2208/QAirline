const Booking = require('../models/Booking');

const getMonthlyRevenue = async (req, res) => {
    const year = parseInt(req.params.year);
    try {
        const data = await Booking.aggregate([
            {
                $match: {
                    booking_date: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`),
                    },
                },
            },
            {
                $group: {
                    _id: {$month: "$booking_date"},
                    totalRevenue: {$sum: "$total_price"},
                },
            },
            {$sort: {_id: 1}},
        ]);

        const monthlyData = Array.from({length: 12}, (_, i) => ({
            month: i + 1,
            totalRevenue: 0,
        }));
        data.forEach(({_id, totalRevenue}) => {
            monthlyData[_id - 1].totalRevenue = totalRevenue;
        });

        return res.status(200).json(monthlyData);
    } catch (err) {
        console.error("Error getting monthly revenue", err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {getMonthlyRevenue};