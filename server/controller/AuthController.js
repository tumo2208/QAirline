const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");
const {nationalities} = require('../shared/SharedData');

const validateUserData = (data, isUpdate = false) => {
    if (!isUpdate) {
        if (!data.full_name || data.full_name.trim() === "") {
            return "Họ và tên không được để trống"; 
        }

        if (!data.gender || data.gender.trim() === "") {
            return "Giới tính không được để trống"; 
        }

        if (!data.dob || data.dob.trim() === "") {
            return "Ngày sinh không được để trống";
        }

        if (!data.nationality || data.nationality.trim() === "") {
            return "Quốc tịch không được để trống";
        }

        if (!data.email || data.email.trim() === "") {
            return "Email không được để trống";
        }

        if (!data.password || data.password.trim() === "") {
            return "Mật khẩu không được để trống";
        }

        if (!data.phone_number || data.phone_number.trim() === "") {
            return "Số điện thoại không được để trống";
        }
    }

    if (data.email && !isValidEmail(data.email)) {
        return "Email không hợp lệ";
    }

    if (data.password && data.password.length < 8) {
        return "Mật khẩu phải có ít nhất 8 kí tự";
    }

    if (data.phone_number && data.phone_number.length < 10) {
        return "Số điện thoại phải có ít nhất 10 kí tự";
    }
    
    if (data.nationality && !nationalities.includes(data.nationality)) {
        return "Quốc tịch không hợp lệ";
    }

    if (data.dob && new Date(data.dob) > new Date()) {
        return "Ngày sinh không thể lớn hơn ngày hiện tại";
    }

    if (data.gender && !['Nam', 'Nữ', 'Khác'].includes(data.gender)) {
        return "Giới tính không hợp lệ";
    }

    return null;
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const register = async (req, res, next) => {
    const { full_name, gender, dob, nationality, email, password, phone_number } = req.body;

    const error = validateUserData({ full_name, gender, email, password, phone_number, nationality, dob }, false);

    if (error) {
        return res.status(400).json({ message: error });
    }

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

const update = async (req, res) => {
    const userId = req.user.id;
    const { full_name, gender, dob, nationality, email, phone_number } = req.body;

    const error = validateUserData({ full_name, gender, email, phone_number, nationality, dob }, true);
    if (error) {
        return res.status(400).json({ message: error });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const updates = {};

        if (full_name && full_name.trim() !== "" && full_name !== user.full_name) updates.full_name = full_name;
        if (gender && gender.trim() !== "" && gender !== user.gender) updates.gender = gender;
        if (dob && dob.trim() !== "" && dob !== user.dob) updates.dob = dob;
        if (nationality && nationality.trim() !== "" && nationality !== user.nationality) updates.nationality = nationality;
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists.id !== userId) {
                return res.status(400).json({ message: "Email này đã được sử dụng" });
            }
            updates.email = email;
        }
        if (phone_number && phone_number.trim() !== "" && phone_number !== user.phone_number) {
            const phoneExists = await User.findOne({ phone_number });
            if (phoneExists && phoneExists.id !== userId) {
                return res.status(400).json({ message: "Số điện thoại này đã được sử dụng" });
            }
            updates.phone_number = phone_number;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Dữ liệu không thay đổi" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        res.status(200).json({
            message: "Cập nhật trang cá nhân thành công!",
            user: {
                full_name: updatedUser.full_name,
                email: updatedUser.email,
                gender: updatedUser.gender,
                dob: updatedUser.dob,
                nationality: updatedUser.nationality,
                phone_number: updatedUser.phone_number,
                created_at: updatedUser.created_at,
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

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Mật khẩu mới quá yếu! Cần ít nhất 8 kí tự!" });
        }

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
