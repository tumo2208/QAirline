import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import {nationalities} from "../../../../server/shared/SharedData";

function Signup() {
    const [full_name, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("Male");
    const [nationality, setNationality] = useState("Vietnam");
    const [dob, setDob] = useState("");
    const [passport, setPassport] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // const nationalities = [
    //   "Vietnam", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
    //   "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    //   "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
    //   "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cape Verde", "Cambodia", "Cameroon",
    //   "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
    //   "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
    //   "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    //   "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    //   "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    //   "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
    //   "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
    //   "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    //   "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
    //   "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    //   "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    //   "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay",
    //   "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    //   "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    //   "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
    //   "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
    //   "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
    //   "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    //   "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    //   "Vanuatu", "Vatican City", "Venezuela", "Yemen", "Zambia", "Zimbabwe"
    // ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        try {
            const response = await axios.post("http://localhost:3001/register", {
                full_name,
                gender,
                dob,
                nationality,
                email,
                phone_number,
                password,
                passport
            },
            { withCredentials: true },
          );
          if (response.data.message === "Registration successful") {
            setError("");
            navigate(`/login`);
          }
        } catch (error) {
          setError("Registration failed. Please try again.");
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
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Others">Khác</option>
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
                            <label className="font-semibold block text-gray-700">Số hộ chiếu</label>
                            <input
                                type="text"
                                value={passport}
                                onChange={(e) => setPassport(e.target.value)}
                                placeholder="Nhập số hộ chiếu"
                                minLength="8"
                                maxLength="15"
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

                    <button
                        className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 ">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6" viewBox="0 0 48 48">
                            <defs>
                                <path id="a"
                                      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
                            </defs>
                            <clipPath id="b">
                                <use xlinkHref="#a" overflow="visible"/>
                            </clipPath>
                            <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z"/>
                            <path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
                            <path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
                            <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
                        </svg>
                        <span className="ml-4 font-semibold">Đăng ký với Google</span>
                    </button>

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