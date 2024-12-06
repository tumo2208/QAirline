import React, { useState, useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import Loading from '../../shared/Loading';
import logo from "../../logo.svg";
import unidecode from 'unidecode';
import { set } from "mongoose";

function ManageBooking() {
    const [activeTab, setActiveTab] = useState("outbound");
    const { state } = useLocation();
    const { booking } = state || null;
    const [roundTrip, setRoundTrip] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [outboundFlight, setOutboundFlight] = useState(null);
    const [returnFlight, setReturnFlight] = useState(null);

    const handleBack = () => {
        navigate("/");
    };

    // This is used to determine if the booking is a one-way or round-trip ticket
    useEffect(() => {
        if (booking?.return_tickets.length === 0) {
            setRoundTrip(false);
        }
    }, [booking]);

    //Fetch flight data
    useEffect( () => {
        async function FetchData() {
            if (booking?.flight_id) {
                try {
                    const response = await axios.post(
                        "http://localhost:3001/api/flights/getFlightByID",
                        { flightID: booking.flight_id },
                        {
                            withCredentials: true,
                        }
                    );
                    if (!response || !response.data) {
                        throw new Error("Invalid response from the server");
                    }
                    setOutboundFlight(response.data);
                } catch (error) {
                    console.error("Error fetching flight details:", error);
                }
            }
            
            if (booking?.return_flight_id) {
                try {
                    const response = await axios.post(
                        "http://localhost:3001/api/flights/getFlightByID",
                        { flightID: booking.return_flight_id },
                        {
                            withCredentials: true,
                        }
                    );
                    if (!response || !response.data) {
                        throw new Error("Invalid response from the server");
                    }
                    setReturnFlight(response.data);
                } catch (error) {
                    console.error("Error fetching flight details:", error);
                }
            }
        }
        FetchData();
    }, [booking]);

    const cancelTicket = async (ticket) => {
        try {
            if (window.confirm("Bạn có chắc chắn muốn hủy vé ?")) {
                let userInput = "";
                if (ticket.customer_type === "Adult") {
                    userInput = window.prompt("Nhập số định danh của người có tên trên vé");
                } else {
                    userInput = window.prompt("Nhập ngày sinh của người có tên trên vé (định dạng dd/mm/yyyy)");
                }
                if (userInput) {
                    setLoading(true);
                    const response = await axios.post(
                        "http://localhost:3001/api/bookings/cancelTicket",
                        { 
                            ticketID: ticket._id,
                            confirmation: userInput,
                        },
                        {
                            withCredentials: true,
                        }
                    );
                    if (response.status === 200) {
                        alert("Hủy vé thành công");
                        navigate("/mybooking/manage-booking", {
                            state: {
                                booking: response.data.newBooking,
                            }
                        });
                    }
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("Thông tin xác nhận không chính xác!");
            } else if (error.response && error.response.status === 403) {
                alert("Bạn không thể hủy vé này vì sẽ vi phạm chính sách về số hành khách của hãng!");
            } else if (error.response && error.response.status === 404) {
                alert("Bạn chỉ có quyền hủy vé ít nhất 7 ngày trước giờ khởi hành!");
            } else {
                console.error("Error cancelling ticket:", error);
                alert("Đã xảy ra lỗi khi hủy vé. Vui lòng thử lại!");
            }
        }
        setLoading(false);
    };
    

    if (!booking) {
        return (
            <div className="bg-gray-10 p-60 flex flex-col items-center justify-center space-y-10">
                <h2 className="text-5xl font-bold text-center text-[#002D74]">Mã đặt chỗ bạn tìm kiếm không tồn tại</h2>
                <div className="text-left mx-8">
                    <button
                        type="button"
                        className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                        onClick={() => handleBack()}
                    >
                        <span className="mr-2 font-bold text-lg">←</span>
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

      

    return (
        <div className="bg-gray-100 p-10">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link
                href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lilita+One&family=Pacifico&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                rel="stylesheet"/>
            <div className="flex flex-col space-y-4 pb-4">
                <h2 className="text-5xl font-bold text-center text-[#002D74]">Mã đặt chỗ của bạn là</h2>
                <p className="text-3xl font-bold text-center">{booking?.booking_id}</p>
            </div>
            <div className="p-10 bg-gray-100 min-h-screen flex flex-col items-center">
                {roundTrip && (
                    <div className="flex space-x-4 mb-6">
                        <button
                            className={`py-2 px-4 rounded-lg font-semibold ${
                                activeTab === "outbound"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                            onClick={() => setActiveTab("outbound")}
                        >
                            Vé chiều đi
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg font-semibold ${
                                activeTab === "return"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                            onClick={() => setActiveTab("return")}
                        >
                            Vé chiều về
                        </button>
                    </div>
                )}

                <div className="w-full">
                    {activeTab === "outbound" && (
                        <div>
                            {Array.from({length: booking?.outbound_tickets?.length}).map((_, index) => (
                            <TicketCard ticket={booking?.outbound_tickets[index]} flight={outboundFlight} class_type={booking?.class_type} cancel={cancelTicket}/>
                        ))}
                        </div>
                    )}
                    {activeTab === "return" && roundTrip && (
                        <div>
                            {Array.from({length: booking?.return_tickets?.length}).map((_, index) => (
                            <TicketCard ticket={booking?.return_tickets[index]} flight={returnFlight} class_type={booking?.return_class_type} cancel={cancelTicket}/>
                        ))}
                        </div>
                    )}
                </div>
            </div>
            {loading && <Loading/>}
        </div>
    )
}

function TicketCard({ticket, flight, class_type, cancel}) {
    const [airportInfo, setAirportInfo] = useState([]);

    useEffect(() => {
        const fetchAirportInfo = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/airportAircraft/allAirports");
                setAirportInfo(response.data.map((airport) => ({
                    name: airport.name,
                    city: airport.city,
                    airport_code: airport.airport_code
                })));
            } catch (error) {
                console.error("Error fetching airports info:", error);
            }
        };

        fetchAirportInfo();
    }, []);

    const getCityFromAirportID = (airportCode) => {
        const airport = airportInfo.find((a) => a.airport_code === airportCode);
        return airport ? airport.city : "";
    };

    return (
        <div className="bg-white border-4 p-2 mx-52 rounded-2xl shadow-lg">
            <div className="flex flex-row">
                <div className="w-full flex-grow flex items-center justify-center p-4"
                     style={{flex: 5}}>
                    <div className="flex w-full max-w-3xl text-zinc-50 h-64">
                        <div className="h-full bg-blue-900 flex items-center justify-center rounded-l-3xl">
                            <img
                                src={logo}
                                className="text-white sm:h-11 rotate-[270deg] filter invert"
                                alt="QAriline Logo"
                            />
                        </div>
                        <div
                            className="relative h-full flex flex-col items-center border-dashed justify-between border-2 bg-zinc-900 border-zinc-50">
                            <div className="absolute rounded-full w-8 h-8 bg-white -top-5"></div>
                            <div className="absolute rounded-full w-8 h-8 bg-white -bottom-5"></div>
                        </div>
                        <div
                            className="h-full py-4 px-10 bg-blue-100 text-black flex-grow rounded-r-3xl flex flex-col">
                            {class_type === "Business" && (
                                <div className="text-center text-yellow-600 text-4xl" style={{fontFamily: "Pacifico"}}>
                                Business Class
                            </div>
                            )}
                            {class_type === "Economy" && (
                                <div className="text-center font-mono font-semibold text-yellow-600 text-4xl">
                                Economy Class
                            </div>
                            )}
                            <div className="flex mt-8 w-full justify-between items-center">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-bold">{flight?.departure_airport_id}</span>
                                    <span className="text-zinc-500 text-sm">{unidecode(getCityFromAirportID(flight?.departure_airport_id))}</span>
                                </div>
                                <div className="flex flex-col flex-grow items-center px-10">
                                    <span className="font-bold text-sm">{flight?.flight_number}</span>
                                    <div className="w-full flex items-center mt-2">
                                        <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
                                        <div
                                            className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
                                        <svg
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            height="2em"
                                            width="2em"
                                        >
                                            <path fill="currentColor" d="M8 13.5v-5l-5 5v-11l5 5v-5L13.5 8z"/>
                                        </svg>
                                        <div
                                            className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
                                        <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-bold">{flight?.arrival_airport_id}</span>
                                    <span className="text-zinc-500 text-sm">{unidecode(getCityFromAirportID(flight?.arrival_airport_id))}</span>
                                </div>
                            </div>
                            <div className="flex w-full mt-auto justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Date</span>
                                    <span className="font-mono">{convertDateFormat(flight?.departure_time)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Departure time</span>
                                    <span className="font-mono">{new Date(flight?.departure_time).toLocaleTimeString("en-GB", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Passenger</span>
                                    <span className="font-mono">{ticket?.customer_details?.customer_name.toUpperCase()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Seat</span>
                                    <span className="font-mono">{ticket?.seat_number}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="text-center my-auto h-full flex justify-center items-center"
                    style={{flex: 1}}
                >
                    <button
                        type="button"
                        onClick={() => cancel(ticket)}
                        className="items-center py-2.5 px-6 text-sm rounded-lg bg-red-500 text-white cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-red-700"
                    >
                        Hủy vé
                    </button>
                </div>
            </div>
        </div>
    )
}

function convertDateFormat(timeInput) {
    const date = new Date(timeInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export default ManageBooking;