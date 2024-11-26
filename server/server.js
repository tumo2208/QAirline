require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("./routes/AuthRoute");
 const airportAircraftRoute = require("./routes/AirportAircraftRoute");
const flightRoute = require("./routes/FlightRoute");
const bookingRoute = require("./routes/BookingRoute");

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
app.use("/api/airportAircraft", airportAircraftRoute);
app.use("/api/flights", flightRoute);
// app.use("/api/users", userRoute);
app.use("/api/bookings", bookingRoute);


app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Connected!');

    app.listen(3001, () => {
        console.log('Server is running on port 3001');
    }); 
})
.catch((err) => {
    console.log('Connection Failed!');
});
