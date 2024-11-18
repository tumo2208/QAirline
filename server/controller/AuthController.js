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

const update = async (req, res) => {
    const userId = req.user.id;
    const { full_name, gender, dob, nationality, email, phone_number, identification_id } = req.body;

    try {
        const updates = {};

        if (full_name) updates.full_name = full_name;
        if (gender) updates.gender = gender;
        if (dob) updates.dob = dob;
        if (nationality) updates.nationality = nationality;
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists.id !== userId) {
                return res.status(400).json({ message: "Email is already in use" });
            }
            updates.email = email;
        }
        if (phone_number) {
            const phoneExists = await User.findOne({ phone_number });
            if (phoneExists && phoneExists.id !== userId) {
                return res.status(400).json({ message: "Phone number is already in use" });
            }
            updates.phone_number = phone_number;
        }
        if (identification_id) {
            const idType = checkIdentification(identification_id);
            if (!idType) {
                return res.status(400).json({ message: "Invalid identification format" });
            }
            updates.identification_id = identification_id;
            updates.id_type = idType;
        }

        // Update the user in the database
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                full_name: user.full_name,
                email: user.email,
                gender: user.gender,
                dob: user.dob,
                nationality: user.nationality,
                phone_number: user.phone_number,
                identification_id: user.identification_id,
                id_type: user.id_type,
                created_at: user.created_at,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user" });
    }
};

module.exports = { login, profile, register, update };
