require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const schedule = require('node-schedule');
const cookieParser = require("cookie-parser");
const nodemailer = require('nodemailer');

// Import routes
const authRoutes = require("./routes/AuthRoute");
const airportAircraftRoute = require("./routes/AirportAircraftRoute");
const postRoute = require('./routes/PostRoute');
const flightRoute = require("./routes/FlightRoute");
const bookingRoute = require("./routes/BookingRoute");
const emailRoute = require('./routes/EmailRoute');

const {updateFlightStatus, updatePrepareFlight} = require("./controller/FlightController");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// routes
// app.use("/api/products", productRoute);

const cors = require("cors");
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Định kỳ cập nhật status của flight
schedule.scheduleJob('*/30 * * * *', async () => {
    console.log('Running flight status update...');
    await updateFlightStatus();
});

schedule.scheduleJob('0 0 * * *', async () => {
    console.log("Checking for flights that are about to depart...");
    await updatePrepareFlight();
});

// Routes
app.use('/', authRoutes);
app.use("/api/airportAircraft", airportAircraftRoute);
app.use("/api/flights", flightRoute);
app.use("/api/post", postRoute);
app.use("/api/bookings", bookingRoute);
app.use("/email", emailRoute);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    }
});

let mailOptions = {
    from: 'bqtrung1001@gmail.com',
    to: 'qairline203@gmail.com',
    subject: 'Nodemailer Project',
    text: 'Hi from your nodemailer project'
};

transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
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
