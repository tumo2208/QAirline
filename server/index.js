require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Import models
const Airport = require("./models/Airport");
const Flight = require("./models/Flight");
const User = require("./models/User");
const Booking = require("./models/Booking");
const Aircraft = require("./models/Aircraft");

// Import routes
const authRoutes = require("./routes/authRoutes");
// const airportRoute = require("./routes/airportRoute");
const flightRoute = require("./routes/FlightRoute");
// const userRoute = require("./routes/userRoute");
// const bookingRoute = require("./routes/bookingRoute");
// const aircraftRoute = require("./routes/aircraftRoute");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// routes
// app.use("/api/products", productRoute);

const cors = require("cors");
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

// Routes
app.use('/', authRoutes);
// app.use("/api/airports", airportRoute);
app.use("/api/flights", flightRoute);
// app.use("/api/users", userRoute);
// app.use("/api/bookings", bookingRoute);
// app.use("/api/aircrafts", aircraftRoute);


app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
.then(() => { 
    console.log('Connected!');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    }); 
})
.catch((err) => {
    console.log('Connection Failed!');
});
