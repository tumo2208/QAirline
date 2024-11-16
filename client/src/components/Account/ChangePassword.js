import {Link} from "react-router-dom";

function ChangePassword() {
    return (
        <section>
            <main id="content" role="main" className="w-full h-screen max-w-md p-6 mx-auto bg-center bg-cover"
                  style={{ backgroundImage: "url('https://i.imgur.com/uWIJU3R.png')" }}>
                <div className="bg-purple-50 border shadow-lg mt-7 rounded-xl">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h1 className="font-bold text-3xl p-10 text-[#002D74]">Đổi mật khẩu</h1>
                        </div>

                        <div className="mt-5">
                            <form>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="old_password"
                                               className="block mb-2 ml-1 text-xs font-semibold ">Mật khẩu cũ</label>
                                        <div className="relative">
                                            <input type="password" id="old_password" name="old_password"
                                                   className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                   required aria-describedby="old-password-error"
                                                   />
                                        </div>
                                        <p className="hidden mt-2 text-xs text-red-600" id="old-password-error"></p>
                                    </div>
                                    <div>
                                        <label htmlFor="new_password"
                                               className="block mb-2 ml-1 text-xs font-semibold ">Mật khẩu mới</label>
                                        <div className="relative">
                                            <input type="password" id="new_password" name="new_password" minLength={8}
                                                   className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                   required aria-describedby="new-password-error"
                                                   />
                                        </div>
                                        <p className="hidden mt-2 text-xs text-red-600" id="new-password-error">Please
                                            include a
                                            password that
                                            complies with the rules to ensure security</p>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmn_new_password"
                                               className="block mb-2 ml-1 text-xs font-semibold ">Nhập lại mật khẩu mới</label>
                                        <div className="relative">
                                            <input type="password" id="confirmn_new_password"
                                                   name="confirmn_new_password"
                                                   className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                   required aria-describedby="confirmn_new-password-error"
                                                   />
                                        </div>
                                        <p className="hidden mt-2 text-xs text-red-600"
                                           id="confirmn_new-password-error"></p>
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

export default ChangePassword;