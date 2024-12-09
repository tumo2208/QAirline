import React, { useState } from 'react';
import { Link} from "react-router-dom";
import axios from 'axios';
import Loading from '../../shared/Loading';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/login', { email, password }, { withCredentials: true });
            if (response.status === 200) {
                window.location.href = 'http://localhost:3000/';
            }
        } catch (error) {
            setError(error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="relative border-red-500 flex items-center justify-center bg-center bg-cover h-full"
                style={{ backgroundImage: "url('https://lindaontherun.com/wp-content/uploads/2021/07/How-to-avoid-getting-sick-on-a-plane-flying.jpg')" }}>
                <div className="bg-gray-100 p-10 my-20 flex rounded-2xl shadow-lg max-w-3xl">
                    <div className="px-5">
                        <h2 className="text-3xl font-bold text-[#002D74]">Đăng nhập</h2>
    
                        <form className="my-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Nhập địa chỉ email"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                            </div>

                            <div className="mt-4">
                                <label htmlFor="password" className="block text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                            </div>

                            {error && <div className="text-red-500 mt-2">{error}</div>}

                            <div className="text-right mt-2">
                                <Link to="/forgot-password" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Quên mật khẩu?</Link>
                            </div>

                            <button type="submit" className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-3">
                                Đăng nhập
                            </button>
                        </form>

                        <div className="mt-7 grid grid-cols-3 items-center text-gray-500">
                            <hr className="border-gray-500" />
                            <p className="text-center text-sm">HOẶC</p>
                            <hr className="border-gray-500" />
                        </div>

                        <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 48 48">
                                <defs>
                                    <path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                                </defs>
                                <clipPath id="b"><use xlinkHref="#a" overflow="visible" /></clipPath>
                                <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                                <path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                                <path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                                <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                            </svg>
                            <span className="ml-4 font-semibold">Đăng nhập với Google</span>
                        </button>

                        <div className="text-sm flex justify-between items-center mt-3">
                            <p>Nếu bạn chưa có tài khoản, <Link to="/signup" className="text-sm font-semibold underline text-blue-500 hover:text-blue-700 focus:text-blue-700">Đăng ký ngay</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <Loading/>}
        </div>
    );
}

export default Login;
