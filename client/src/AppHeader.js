import {Link} from "react-router-dom";
import logo from "./logo.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import Notification from "./shared/Notification";

function AppHeader() {
    const [loginState, setLoginState] = useState(false);
    const [userName, setUserName] = useState(null);
    const [userGender, setUserGender] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [content, setContent] = useState("");

    const showNoti = (newContent, timeout) => {
        setContent(newContent);
        setShowPrompt(true);
        setTimeout(() => {
            setShowPrompt(false);
        }, timeout);
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleLogout = async () => {
        try {
            await axios.get(`http://localhost:3001/logout`, {
                withCredentials: true,
            });
            showNoti("Đăng xuất thành công, đang đăng xuất...", 2000);
            await delay(2000);
            setLoginState(false);
            window.location.reload();
        } catch (error) {
            console.error("Đăng xuất thất bại:", error);
        }
    };

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/profile`, {
                    withCredentials: true,
                });
                showNoti("Bạn đã đăng nhập thành công !", 3000);
                setUserName(response.data.user.full_name);
                setUserGender(response.data.user.gender);
                setLoginState(true);
                if (response.data.user.user_type === "Admin") {
                    setIsAdmin(true);
                    showNoti("Bạn đã đăng nhập thành công với tư cách quản trị viên !", 3000);
                }
            } catch (error) {
                console.error("Đăng nhập thất bại:", error);
            }
        };
        checkLogin();
    }, []);

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
        setIsMenuVisible((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest("#menu-container")) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="sticky z-10 top-0 font-bold border-gray-200 p-1 h-50"
             style={{height: "75px", backgroundColor: "#eaf6f6"}}>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                rel="stylesheet"/>
            <div
                className="flex flex-wrap items-center justify-between max-w-screen-xl px-1 mx-auto select-none"
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
                           className="border border-gray-300 font-normal rounded-xl px-3 py-1 focus:outline-none focus:border-blue-500"/>
                    <button className="absolute right-2 top-1.5 text-gray-500">
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            height="1.5em"
                            width="1.5em"
                        >
                            <path
                                d="M10 18a7.952 7.952 0 004.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0018 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/>
                        </svg>
                    </button>
                </div>

                {loginState ? (
                    <div id="menu-container" className="flex items-center lg:order-3 space-x-2">
                        <p className="font-semibold">{userName}</p>
                        <div id="profile">
                            <img src={`/../images/avatar/${userGender}.png`}
                                 onClick={toggleMenu}
                                 className="cursor-pointer w-12 h-12" alt="user"/>

                            {isMenuVisible && (
                                <ul
                                    role="menu"
                                    data-popover="profile-menu"
                                    data-popover-placement="bottom"
                                    className="absolute mr-5 overflow-auto rounded-lg border border-slate-200 bg-gray-100 p-1.5 shadow-lg focus:outline-none"
                                    style={{marginLeft: "-50px"}}
                                >
                                    <li
                                        role="menuitem"
                                    >
                                        <Link to="/profile"
                                              onClick={closeMenu}
                                              className="menu-item profileMenuItem">
                                            <svg
                                                viewBox="0 0 448 512"
                                                fill="currentColor"
                                                height="1.5em"
                                                width="1.5em"
                                            >
                                                <path
                                                    d="M272 304h-96C78.8 304 0 382.8 0 480c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32 0-97.2-78.8-176-176-176zM48.99 464c7.9-63.1 61.81-112 127.01-112h96c65.16 0 119.1 48.95 127 112H48.99zM224 256c70.69 0 128-57.31 128-128S294.69 0 224 0 96 57.31 96 128c0 70.7 57.3 128 128 128zm0-208c44.11 0 80 35.89 80 80s-35.89 80-80 80-80-35.9-80-80c0-44.11 35.9-80 80-80z"/>
                                            </svg>

                                            <p className="text-slate-800 font-medium ml-2">
                                                Trang cá nhân
                                            </p>
                                        </Link>
                                    </li>
                                    <li
                                        role="menuitem"
                                    >
                                        <Link to="/change-password"
                                              onClick={closeMenu}
                                              className="menu-item profileMenuItem">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                height="1.5em"
                                                width="1.5em"
                                            >
                                                <path fill="none" d="M0 0h24v24H0z"/>
                                                <path
                                                    d="M18 8h2a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h2V7a6 6 0 1112 0v1zM5 10v10h14V10H5zm6 4h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2zm1-6V7a4 4 0 10-8 0v1h8z"/>
                                            </svg>

                                            <p className="text-slate-800 font-medium ml-2">
                                                Đổi mật khẩu
                                            </p>
                                        </Link>
                                    </li>
                                    <li
                                        role="menuitem"
                                    >
                                        <Link to="/mybooking/booking-history"
                                              onClick={closeMenu}
                                              className="menu-item profileMenuItem">
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                                height="1.5em"
                                                width="1.5em"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z"/>
                                                <path
                                                    d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2"/>
                                            </svg>

                                            <p className="text-slate-800 font-medium ml-2">
                                                Lịch sử đặt chỗ
                                            </p>
                                        </Link>
                                        
                                    </li>
                                    {isAdmin && (
                                        <li
                                            role="menuitem"
                                        >
                                            <Link to="/admin"
                                                onClick={closeMenu}
                                                className="menu-item profileMenuItem">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    height="1.5em"
                                                    width="1.5em"
                                                    >
                                                    <path fill="none" d="M0 0h24v24H0z" />
                                                    <path d="M12 14v2a6 6 0 00-6 6H4a8 8 0 018-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm9 6h1v5h-8v-5h1v-1a3 3 0 016 0v1zm-2 0v-1a1 1 0 00-2 0v1h2z" />
                                                </svg>

                                                <p className="text-slate-800 font-medium ml-2">
                                                    Quản trị viên
                                                </p>
                                            </Link>
                                        </li>
                                    )}
                                    <li
                                        role="menuitem"
                                        onClick={closeMenu}
                                        className="menu-item profileMenuItem"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            height="1.5em"
                                            width="1.5em"
                                        >
                                            <path
                                                d="M12 6a3.939 3.939 0 00-3.934 3.934h2C10.066 8.867 10.934 8 12 8s1.934.867 1.934 1.934c0 .598-.481 1.032-1.216 1.626a9.208 9.208 0 00-.691.599c-.998.997-1.027 2.056-1.027 2.174V15h2l-.001-.633c.001-.016.033-.386.441-.793.15-.15.339-.3.535-.458.779-.631 1.958-1.584 1.958-3.182A3.937 3.937 0 0012 6zm-1 10h2v2h-2z"/>
                                            <path
                                                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                                        </svg>

                                        <p className="text-slate-800 font-medium ml-2">
                                            Trợ giúp
                                        </p>
                                    </li>
                                    <hr className="my-2 border-slate-200" role="menuitem"/>
                                    <li
                                        role="menuitem"
                                        onClick={handleLogout}
                                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            height="1.5em"
                                            width="1.5em"
                                        >
                                            <path
                                                d="M4 12a1 1 0 001 1h7.59l-2.3 2.29a1 1 0 000 1.42 1 1 0 001.42 0l4-4a1 1 0 00.21-.33 1 1 0 000-.76 1 1 0 00-.21-.33l-4-4a1 1 0 10-1.42 1.42l2.3 2.29H5a1 1 0 00-1 1zM17 2H7a3 3 0 00-3 3v3a1 1 0 002 0V5a1 1 0 011-1h10a1 1 0 011 1v14a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-2 0v3a3 3 0 003 3h10a3 3 0 003-3V5a3 3 0 00-3-3z"/>
                                        </svg>

                                        <p className="text-slate-800 font-medium ml-2">
                                            Đăng xuất
                                        </p>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4 lg:order-3">
                        <div id="auth-buttons" className="flex items-center space-x-1">
                            <Link to="/login">
                                <button
                                    className="bg-blue-900 text-white px-3 py-1 rounded-3xl font-semibold hover:bg-blue-700">
                                    Đăng nhập
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button
                                    className="border border-blue-600 text-blue-600 px-3 py-1 rounded-3xl font-semibold hover:bg-blue-100">
                                    Đăng ký
                                </button>
                            </Link>
                        </div>
                    </div>
                )}


                <button
                    data-collapse-toggle="mobile-menu-2"
                    type="button"
                    className="inline-flex items-center p-2 ml-1 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="mobile-menu-2"
                    aria-expanded="true"
                >
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        height="1.5em"
                        width="1.5em"
                    >
                        <path d="M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 z"/>
                        <path d="M7 8h10M7 12h10M7 16h10"/>
                    </svg>
                </button>

                <div
                    className="items-center justify-between w-full lg:flex lg:w-auto lg:order-1"
                    id="mobile-menu-2"
                    style={{fontFamily: "Pangolin, sans-serif", fontSize: "large"}}
                >
                    <ul
                        className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0"
                    >
                        <li>
                            <Link
                                to="/explore"
                                className="navItem"
                                aria-current="page"
                            >KHÁM PHÁ</Link>
                        </li>
                        <li>
                            <Link
                                to="/booking"
                                className="navItem"
                            >ĐẶT VÉ</Link>
                        </li>
                        <li>
                            <Link
                                to="/flight-info"
                                className="navItem"
                            >THÔNG TIN CHUYẾN BAY</Link>
                        </li>
                        <li>
                            <Link
                                to="/mybooking"
                                className="navItem"
                            >VÉ CỦA TÔI</Link>
                        </li>
                    </ul>
                </div>
            </div>
            {showPrompt && <Notification content={content}/>}
        </nav>
    )
}

export default AppHeader;