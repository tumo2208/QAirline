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
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, password }, { withCredentials: true });
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
