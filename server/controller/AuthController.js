const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");

const register = async (req, res, next) => {
    const { full_name, gender, dob, nationality, email, password, phone_number } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        const newUser = await User.create({
            full_name,
            gender,
            dob,
            nationality,
            email,
            password,
            phone_number
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });

      res.status(201).json({ message: "Đăng ký tài khoản thành công!", token });
      next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi đăng ký" });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Sai email hoặc mật khẩu." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai email hoặc mật khẩu." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
          });

        res.status(200).json({ message: "Đăng nhập thành công", token });
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi đăng nhập" });
    }
};

const profile = async (req, res) => {
    try {
        const user = req.user;

        res.json({
            message: "Lấy thông tin người dùng thành công",
            user: {
                full_name: user.full_name,
                email: user.email,
                gender: user.gender,
                nationality: user.nationality,
                dob: user.dob,
                phone_number: user.phone_number,
                user_type: user.user_type,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Token không hợp lệ" });
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
    const { full_name, gender, dob, nationality, email, phone_number } = req.body;

    try {
        const updates = {};

        if (full_name) updates.full_name = full_name;
        if (gender) updates.gender = gender;
        if (dob) updates.dob = dob;
        if (nationality) updates.nationality = nationality;
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists.id !== userId) {
                return res.status(400).json({ message: "Email này đã được sử dụng" });
            }
            updates.email = email;
        }
        if (phone_number) {
            const phoneExists = await User.findOne({ phone_number });
            if (phoneExists && phoneExists.id !== userId) {
                return res.status(400).json({ message: "Số điện thoại này đã được sử dụng" });
            }
            updates.phone_number = phone_number;
        }

        // Update the user in the database
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        res.status(200).json({
            message: "Cập nhật trang cá nhân thành công!",
            user: {
                full_name: user.full_name,
                email: user.email,
                gender: user.gender,
                dob: user.dob,
                nationality: user.nationality,
                phone_number: user.phone_number,
                created_at: user.created_at,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi cập nhật người dùng" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Xác nhận lại mật khẩu bị sai. Xin hãy thử lại!" });
        }

        const email = req.user.email;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Nhập sai mật khẩu" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Mật khẩu mới quá yếu! Cần ít nhất 8 kí tự!" });
        }

        user.password = newPassword;

        await user.save();

        return res.status(200).json({ message: "Mật khẩu cập nhật thành công!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi cập nhật mật khẩu!" });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy token" });
        }

        await redisClient.SADD("blacklisted_token", token, { EX: 86400 });
        res.clearCookie("token");

        return res.status(200).json({ message: "Đăng xuất thành công!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Gặp lỗi khi đăng xuất!" });
    }
};

module.exports = { login, profile, register, update, changePassword, logout };
