import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';

import axios from 'axios';


function BookingHistory() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/bookings/myBookings`, {
                    withCredentials: true,
                });
                setBookings(response.data);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    setIsLogin(false);
                }
                console.error("Error fetching booking data: ", error);
            }
        };
        fetchData();
    }, []);

    if (!isLogin) {
        return (
            <div className="bg-gray-10 px-10 py-32 flex flex-col items-center justify-center space-y-10">
                <h2 className="text-3xl lg:text-5xl font-bold text-center text-[#002D74]">Vui lòng đăng nhập để có thể xem được lịch sử đặt chỗ</h2>
                <div className="text-left mx-8">
                    <button
                        type="button"
                        className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                        onClick={() => navigate("/login")}
                    >
                        Đăng nhập
                        <span className="ml-2 font-bold text-lg">→</span>
                    </button>
                </div>
            </div>
        );
    }

    if (!bookings) {
        return (
            <div className="bg-gray-10 p-60 flex flex-col items-center justify-center space-y-10">
                <h2 className="text-5xl font-bold text-center text-[#002D74]">Bạn chưa từng đặt vé, không tồn tại lịch sử đặt chỗ của bạn</h2>
                <div className="text-left mx-8">
                    <button
                        type="button"
                        className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                        onClick={() => navigate("/booking")}
                    >
                        Đặt vé ngay
                        <span className="ml-2 font-bold text-lg">→</span>
                    </button>
                </div>
            </div>
        );
    }

    const handleSelect = async (bookingID) => {
        try {
            const response = await axios.post(
                "http://localhost:3001/api/bookings/getBookingByID", 
                {bookingID : bookingID},
                {
                    withCredentials: true
                }
            );
            console.log(`Response data: ${JSON.stringify(response.data)}`);

            if (response.status === 200) {
                navigate("/mybooking/manage-booking", {
                    state: {
                        booking: response.data,
                    }
                });
            } else {
                navigate("/mybooking/manage-booking", { state: null });
            }
        } catch (error) {
            navigate("/mybooking/manage-booking", { state: null });
        }
    }


    return (
        <div className="bg-gray-100 p-10">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lilita+One&family=Pacifico&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                rel="stylesheet"/>
            <h2 className="text-5xl font-bold text-center text-[#002D74]">Lịch sử đặt chỗ</h2>
            <div className="px-40 py-10 bg-gray-100 min-h-screen flex flex-col space-y-4 w-full items-center">
            {[...bookings].reverse().map((booking) => (
                <BookingCard booking={booking} onSelect={handleSelect} />
            ))}
            </div>
        </div>
    )
}

function BookingCard({booking, onSelect}) {
    return (
        <div className="flex flex-row bg-white border-4 rounded-2xl shadow-lg">
            <div className=" flex justify-between items-center"
                 >
                <div className="flex flex-col space-y-2 p-10">
                    <div className="text-center text-3xl text-blue-700 font-bold whitespace-nowrap">Mã đặt chỗ</div>
                    <div className="text-center text-2xl text-yellow-600 font-bold whitespace-nowrap">{booking.booking_id}</div>
                </div>
                <div className="hidden lg:flex md:flex flex-col space-y-1 p-10">
                        <div className="text-center text-lg font-semibold whitespace-nowrap">Thời gian đặt chỗ</div>
                        <div className="text-center whitespace-nowrap">{formatDate(new Date(booking.booking_date))}</div>
                    </div>
                <div className="hidden lg:flex">
                    <div className="flex flex-col space-y-1 p-10">
                        <div className="text-center text-lg font-semibold whitespace-nowrap">Số hành khách</div>
                        <div className="text-center whitespace-nowrap">{booking.num_adult + booking.num_child + booking.num_infant}</div>
                    </div>
                    <div className="flex flex-col space-y-1 p-10">
                        <div className="text-center text-lg font-semibold whitespace-nowrap">Tổng tiền</div>
                        <div className="text-center whitespace-nowrap">{new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "VND"
                    }).format(booking.total_price)} VND</div>
                    </div>
                </div>
            </div>
            <div className="text-center p-10 my-auto h-full flex justify-center items-center">
                    <button
                        type="button"
                        className="items-center py-2.5 px-6 text-sm rounded-lg bg-blue-700 text-white cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-blue-900"
                        onClick={() => onSelect(booking.booking_id)}
                    >
                        Xem chi tiết
                    </button>
                </div>
        </div>
    );
}

function formatDate(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  }

export default BookingHistory;