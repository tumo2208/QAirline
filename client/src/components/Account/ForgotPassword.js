import {Link} from "react-router-dom";
import React from "react";

function ForgotPassword() {
    return (
        <section>
            <main id="content" role="main" className="w-full h-screen max-w-md p-6 mx-auto bg-center bg-cover"
                  style={{backgroundImage: "url('https://i.imgur.com/uWIJU3R.png')"}}>
                <div className="bg-purple-50 border shadow-lg mt-7 rounded-xl">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h1 className="font-bold text-3xl px-10 pt-10 pb-5 text-[#002D74]">Quên mật khẩu</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Nếu bạn nhớ mật khẩu, đăng nhập <Link to="/login"
                                      className="text-sm font-semibold underline text-blue-500 hover:text-blue-700 focus:text-blue-700">tại
                                    đây</Link>
                            </p>
                        </div>

                        <div className="mt-5">
                            <form>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="old_password"
                                               className="block mb-2 ml-1 text-xs font-semibold ">Email</label>
                                        <div className="relative">
                                            <input type="email"
                                                   className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                   required aria-describedby="old-password-error"
                                                   placeholder="Nhập email"/>
                                        </div>
                                    </div>

                                    <button type="submit"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition-all bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        Đặt lại mật khẩu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default ForgotPassword;