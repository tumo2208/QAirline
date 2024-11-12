const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    const { username, full_name, email, password, gender, age, nationality } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
  
        const newUser = await User.create({
            username,
            full_name,
            email,
            password,
            gender,
            age,
            nationality
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });

      res.json({ token });
      next()

    } catch (error) {
      console.error(error);
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
          });

        res.json({ token });
        next()

    } catch (error) {
        console.error(error);
    }
};

const profile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = req.user;
        res.json({
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            gender: user.gender,
            age: user.age,
            nationality: user.nationality
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { login, profile, register };
