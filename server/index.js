require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// Import models
const Airport = require("./models/Airport");
const Flight = require("./models/Flight");
const User = require("./models/User");
const Booking = require("./models/Booking");
const Aircraft = require("./models/Aircraft");

// Import routes
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
// app.use("/api/products", productRoute);

const cors = require("cors");
app.use(cors());

// Routes
app.use('/', authRoutes);


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
