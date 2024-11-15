const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    const { full_name, gender, dob, nationality, email, password, phone_number, passport} = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email is already used" });
        }
  
        const newUser = await User.create({
            full_name,
            gender,
            dob,
            nationality,
            email,
            password,
            phone_number,
            passport
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });

      res.status(201).json({ message: "Registration successful", token });
      next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Incorrect password or email" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password or email" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
          });

        res.status(200).json({ message: "Login successful", token });
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error login user" });
    }
};

const profile = async (req, res) => {
    try {
        const user = req.user;

        res.json({
            message: "User profile retrieved successfully",
            user: {
                full_name: user.full_name,
                email: user.email,
                gender: user.gender,
                age: user.age,
                nationality: user.nationality,
                dob: user.dob,
                phone_number: user.phone_number,
                passport: user.passport,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid token" });
    }
};

module.exports = { login, profile, register };
