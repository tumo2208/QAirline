const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    const { full_name, gender, dob, nationality, email, password, phone_number, identification_id} = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email is already used" });
        }

        let id_type = checkIdentification(identification_id);
  
        const newUser = await User.create({
            full_name,
            gender,
            dob,
            nationality,
            email,
            password,
            phone_number,
            identification_id,
            id_type
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
                identification_id: user.identification_id,
                id_type: user.id_type,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid token" });
    }
};

function checkIdentification(identifiation_id) {
    if (/^[A-Z][0-9]{8,14}$/.test(identifiation_id)) {
        return 'Passport';
    } else if (/^\d{8,12}$/.test(identifiation_id)) {
        return 'Citizen ID';
    } else {
        return null;
    }
}

const updateIdentification = async (req, res) => {
    const { identification_id } = req.body;
    const userId = req.user.id;

    try {
        let id_type = '';

        if (!checkIdentification(identification_id)) {
            return res.status(400).json({ message: "Invalid identification format. Must be a valid citizen ID or passport." });
        }

        id_type = checkIdentification(identification_id);

        // Update the user's identification
        const user = await User.findByIdAndUpdate(
            userId,
            { identification_id, id_type },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Identification updated successfully",
            identification_id: user.identification_id,
            id_type: user.id_type
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating identification" });
    }
};

module.exports = { login, profile, register, updateIdentification };
