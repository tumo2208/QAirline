import {Link} from "react-router-dom";
import logo from "./logo.svg";

function AppHeader() {
    return (
        <nav className="sticky top-0 font-bold border-gray-200 p-1 h-50"
             style={{height: "75px", backgroundColor: "#eaf6f6"}}>
            <div
                className="flex flex-wrap items-center justify-between max-w-screen-xl px-1 mx-auto"
            >
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        className="h-full w-full sm:h-11 p-1.5"
                        style={{width: "200px", height: "65px"}}
                        alt="QAriline Logo"
                    />
                </Link>

                <div className="relative lg:order-2">
                    <input type="text" placeholder="Tìm kiếm ..."
                           className="border border-gray-300 rounded-xl px-3 py-1 focus:outline-none focus:border-blue-500"/>
                    <button className="absolute right-2 top-1 text-gray-500">
                        🔍
                    </button>
                </div>

                <div className="flex items-center space-x-4 lg:order-3">
                    <div id="account" className="relative flex items-center space-x-1">
                        <Link to="/login">
                            <button
                                className="bg-blue-900 text-white px-3 py-1 rounded-3xl font-semibold hover:bg-blue-700">Đăng
                                nhập
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button
                                className="border border-blue-600 text-blue-600 px-3 py-1 rounded-3xl font-semibold hover:bg-blue-100">Đăng
                                ký
                            </button>
                        </Link>
                    </div>


                    <div className="cursor-pointer scale-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                        </svg>

                    </div>

                    <button
                        data-collapse-toggle="mobile-menu-2"
                        type="button"
                        className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="mobile-menu-2"
                        aria-expanded="true"
                    >
                        ☰
                    </button>
                </div>
                <div
                    className="items-center justify-between w-full lg:flex lg:w-auto lg:order-1"
                    id="mobile-menu-2"
                >
                    <ul
                        className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0"
                    >
                        <li>
                            <Link
                                to="/explore"
                                className="navItem"
                                aria-current="page"
                            >Khám phá</Link>
                        </li>
                        <li>
                            <Link
                                to="/booking"
                                className="navItem"
                            >Đặt vé</Link>
                        </li>
                        <li>
                            <Link
                                to="/travel-info"
                                className="navItem"
                            >Thông tin hành trình</Link>
                        </li>
                        <li>
                            <Link
                                to="/help"
                                className="navItem"
                            >Trợ giúp</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default AppHeader;