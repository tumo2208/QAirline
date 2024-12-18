import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Loading from '../../shared/Loading';
import BookingHistory from "./BookingHistory";

function HomePage(){
    const [activeTab, setActiveTab] = useState("searchbooking");
    const navigate = useNavigate();
    const [bookingID, setBookingID] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bookingID) {
            alert("Please fill in all required fields.");
            return;
        }

        setLoading(true);

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
        <div>
            <div className="py-10 select-none" style={{backgroundImage: "url('https://wallpapercat.com/w/full/3/b/d/21204-1920x1200-desktop-hd-clouds-background-photo.jpg')"}}>
            <div className="border-4 mx-auto max-w-5xl my-5 rounded-2xl shadow-lg">
                <div className="flex select-none cursor-pointer justify-between text-white text-center w-full font-bold">
                    <button
                        className={`text-lg rounded-tl-lg w-1/2 py-3 ${
                            activeTab === "searchbooking"
                                ? "bg-blue-300 text-black"
                                : "bg-blue-800 text-white"
                        }`}
                        onClick={() => setActiveTab("searchbooking")}
                    >
                        TRA CỨU MÃ ĐẶT CHỖ
                    </button>
                    <button
                        className={`text-lg rounded-tr-lg py-3 w-1/2 ${
                            activeTab === "bookinghistory"
                                ? "bg-blue-300 text-black"
                                : "bg-blue-800 text-white"
                        }`}
                        onClick={() => setActiveTab("bookinghistory")}
                    >
                        LỊCH SỬ ĐẶT CHỖ
                    </button>
                </div>
                <div>
                    {activeTab === "searchbooking" && (
                        <div className="relative">
                            <img
                                className="w-full h-full md:block lg:block  rounded-b-2xl object-fit object-center"
                                style={{height: "500px"}}
                                src="https://i.imgur.com/6nhgeK0.png"
                                alt=""
                            />
                            <div className="max-w-sm absolute lg:bottom-24 lg:left-24 md:bottom-24 md:left-24 left-10 bottom-10 rounded-2xl bg-gray-100 md:bg-transparent lg:bg-transparent  lg:px-4 lg:py-5 md:px-4 md:py-5 p-20">
                                <h2 className="lg:text-3xl md:text-3xl text-xl font-bold text-center text-[#002D74]">NHẬP MÃ ĐẶT CHỖ</h2>
                                <form className="space-y-7 py-12" onSubmit={handleSubmit}>
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
                    )}
                    {
                        activeTab === "bookinghistory" && (
                            <div className=" bg-gray-100">
                                <BookingHistory/>
                            </div>
                        )
                    }
                </div>

            </div>
        </div>
        {loading && <Loading/>}
        </div>
    )
}

export default HomePage;