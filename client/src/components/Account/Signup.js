import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import {nationalities} from "../../shared/SharedData";

function Signup() {
    const [full_name, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("Nam");
    const [nationality, setNationality] = useState("Vietnam");
    const [dob, setDob] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setError("Mật khẩu không khớp. Vui lòng thử lại.");
          return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
                full_name,
                gender,
                dob,
                nationality,
                email,
                phone_number,
                password
            },
            { withCredentials: true },
          );
            if (response.status === 201) {
                setSuccess("Đăng ký thành công, chuyển hướng tới trang đăng nhập...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
                setTimeout(() => {
                    setError('');
                }, 2000);
            }
      }
  };

  return (
    <div className="signup-container">
        <div className="relative border-red-500 flex items-center justify-center bg-center bg-cover"
            style={{
                backgroundImage: "url('https://lindaontherun.com/wp-content/uploads/2021/07/How-to-avoid-getting-sick-on-a-plane-flying.jpg')",
            }}>
            <div className="bg-gray-100 p-10 my-14 flex rounded-2xl shadow-lg max-w-3xl">
                <div className="px-5">
                    <h2 className="text-3xl font-bold text-[#002D74]">Đăng ký thành viên</h2>

                    <form className="mt-6 space-y-4 flex flex-col" onSubmit={handleSubmit}>
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Họ và tên</label>
                            <input
                              type="text" 
                              name="" 
                              id="" 
                              value={full_name}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="VD: Nguyễn Văn A"
                              className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                  autoFocus required
                            />
                        </div>

                        <div className="flex flex-row space-x-4">
                            <div className="flex-1">
                                <label className="font-semibold block text-gray-700">Giới tính</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none">
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="font-semibold block text-gray-700">Quốc tịch</label>
                                <select
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    required
                                >
                                    {nationalities.map((nation, index) => (
                                        <option key={index} value={nation}>{nation}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Số điện thoại</label>
                            <input
                                type="text"
                                name=""
                                id=""
                                value={phone_number}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder='Nhập số điện thoại'
                                minLength="10"
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Ngày sinh</label>
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <label className="font-semibold block text-gray-700">Email</label>
                            <input 
                              type="email" 
                              name="" 
                              id="" 
                              placeholder="VD: example@abc.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" required
                            />
                        </div>

                        <div className="mt-4">
                            <label className="font-semibold block text-gray-700">Mật khẩu</label>
                            <input 
                              type="password" 
                              name="" 
                              id=""
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                              minLength="8"
                              className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none" required/>
                        </div>

                        <div className="mt-4">
                            <label className="font-semibold block text-gray-700">Nhập lại mật khẩu</label>
                            <input 
                              type="password" 
                              name="" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              id="" placeholder="Nhập lại mật khẩu" minLength="8"
                                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none" required/>
                        </div>
                        
                        {success && <div className="text-green-500 mt-2">{success}</div>}
                        {error && <div className="text-red-500 mt-2">{error}</div>}

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="terms" required className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                            <label htmlFor="terms" className="text-gray-700 font-semibold">
                                Tôi đồng ý với các
                                <Link to ="/terms"
                                  className="italic text-blue-600 hover:underline"> điều khoản và chính sách
                                </Link> sử dụng.
                            </label>
                        </div>

                        <button type="submit" className="w-full text-lg block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg
                px-4 py-3 mt-6">Đăng ký
                        </button>
                    </form>

                    <div className="mt-7 grid grid-cols-3 items-center text-gray-500">
                        <hr className="border-gray-500"/>
                        <p className="text-center text-sm">HOẶC</p>
                        <hr className="border-gray-500"/>
                    </div>

                    <div className="flex justify-center items-center mt-3">
                        <p>Bạn đã có tài khoản, hãy đăng nhập <Link to="/login"
                                                            className="text-sm font-semibold underline text-blue-500 hover:text-blue-700 focus:text-blue-700">tại đây</Link></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Signup;