import React, { useState } from "react";
import {useLocation} from "react-router-dom";
import logo from "../../logo.svg";

function SearchBooking() {
    const [activeTab, setActiveTab] = useState("outbound");
    const { state } = useLocation();
    const { booking } = state;
    const [roundTrip, setRoundTrip] = useState(true);
    console.log(booking?.outbound_tickets[0].seat_number);
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
                            <TicketCard ticket={booking?.outbound_tickets[index]} flight_id={booking?.flight_id} class_type={booking?.class_type}/>
                        ))}
                        </div>
                    )}
                    {activeTab === "return" && (
                        <div>
                            {Array.from({length: booking?.return_tickets?.length}).map((_, index) => (
                            <TicketCard ticket={booking?.return_tickets[index]} flight_id={booking?.return_flight_id} class_type={booking?.return_class_type}/>
                        ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function TicketCard({ticket, flight_id, class_type}) {
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
                                    <span className="text-4xl font-bold">HAN</span>
                                    <span className="text-zinc-500 text-sm">Hanoi</span>
                                </div>
                                <div className="flex flex-col flex-grow items-center px-10">
                                    <span className="font-bold text-sm">{flight_id}</span>
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
                                    <span className="text-4xl font-bold">SGN</span>
                                    <span className="text-zinc-500 text-sm">Ho Chi Minh City</span>
                                </div>
                            </div>
                            <div className="flex w-full mt-auto justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Date</span>
                                    <span className="font-mono">09/06/2023</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Departure</span>
                                    <span className="font-mono">17:45</span>
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
                        className="items-center py-2.5 px-6 text-sm rounded-lg bg-red-500 text-white cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-red-700"
                    >
                        Hủy vé
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchBooking;