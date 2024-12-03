import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function HomePage(){
    const navigate = useNavigate();
    const [bookingID, setBookingID] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bookingID) {
            alert("Please fill in all required fields.");
        }
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
                navigate("/mybooking/search-booking", {
                    state: {
                        booking: response.data,
                    }
                });
            } else {
                navigate("/mybooking/search-booking", { state: null });
            }
        } catch (error) {
            navigate("/mybooking/search-booking", { state: null });
        }
    }
    return (
        <div className="py-10" style={{backgroundImage: "url('https://wallpapercat.com/w/full/3/b/d/21204-1920x1200-desktop-hd-clouds-background-photo.jpg')"}}>
            <div className="  border-4 mx-60 my-5 rounded-2xl shadow-lg"
                 >
                <div className="flex select-none cursor-pointer  justify-between text-white text-center w-full font-bold">
                    <div className="bg-blue-800 text-lg rounded-tl-lg w-1/2 py-3">
                        TRA CỨU MÃ ĐẶT CHỖ
                    </div>
                    <div className="bg-blue-300 text-lg rounded-tr-lg py-3 w-1/2">
                        LỊCH SỬ ĐẶT CHỖ
                    </div>
                </div>
                <div
                    className="relative"
                >
                    <img
                        className="w-full h-full md:block lg:block hidden rounded-b-2xl object-fit object-center"
                        style={{height: "500px"}}
                        src="https://i.imgur.com/6nhgeK0.png"
                        alt=""
                    />
                    <div className="absolute bottom-32 left-24  px-4 py-5 sm:p-0">
                        <h2 className="text-3xl font-bold text-center text-[#002D74]">Nhập mã đặt chỗ</h2>
                        <form className="space-y-7 p-12" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-gray-600 text-left text-sm font-medium"> Mã đặt chỗ</label>
                                <input type="text"
                                       className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-gray-700 text-sm"
                                       required
                                       value={bookingID}
                                       onChange={(e) => setBookingID(e.target.value)}
                                       />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg p-3">
                                Tra cứu
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HomePage;