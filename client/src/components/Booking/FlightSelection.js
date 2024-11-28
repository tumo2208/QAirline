import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingInfo from "./BookingInfo";

function FlightSelection() {
    const { state } = useLocation();
    const { flights, tripType, passengers } = state;
    const navigate = useNavigate();

    const [showOutbound, setShowOutbound] = useState(true);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);

    let outboundFlights = [];
    let returnFlights = [];

    if (tripType === "round-trip") {
        outboundFlights = flights?.outboundFlights || [];
        returnFlights = flights?.returnFlights || [];
    } else if (tripType === "one-way") {
        outboundFlights = flights || [];
    }

    const handleSelect = (flight, classType) => {
        if (showOutbound) {
            setSelectedOutbound({
                flight,
                classType,
            });
        } else {
            setSelectedReturn({
                flight,
                classType,
            });
        }
    };

    const navigateToPassengers = (selectedFlights) => {
        navigate("/booking/passengers", { state: { flights: selectedFlights } });
    }

    const handleNext = () => {
        if (tripType === "one-way") {
            if (!selectedOutbound) {
                alert("Please select your flight.");
                return;
            }
            navigateToPassengers({ outbound: selectedOutbound });
        } else if (tripType === "round-trip") {
            if (showOutbound) {
                if (!selectedOutbound) {
                    alert("Please select your outbound flight.");
                    return;
                }
                setShowOutbound(false);
            } else {
                if (!selectedReturn) {
                    alert("Please select your return flight.");
                    return;
                }
                navigateToPassengers({ outbound: selectedOutbound, return: selectedReturn });
            }
        }
    }

    const handleBack = () => {
        setShowOutbound(true);
    };

    const totalCost =
        (selectedOutbound?.flight?.available_seats.find((seat) => seat.class_type === selectedOutbound.classType)?.price || 0) +
        (selectedReturn?.flight?.available_seats.find((seat) => seat.class_type === selectedReturn.classType)?.price || 0);

    return (
        <div className="bg-gray-100 flex">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link
                href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lilita+One&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                rel="stylesheet"/>
            <div className="max-w-5xl mx-8 py-8"
                 style={{flex:7}}>
                <div className="sticky top-20 z-20 bg-yellow-100 p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex items-center justify-center space-x-4"
                         style={{fontFamily: "Barlow Condensed"}}>
                        <div className="text-3xl font-semibold">
                            {outboundFlights[0]?.departure_airport?.city || "Depart"}
                        </div>
                        <div className="px-10 text-blue-600">
                            <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                height="2em"
                                width="2em"
                            >
                                <path
                                    d="M8.4 12H2.8L1 15H0V5h1l1.8 3h5.6L6 0h2l4.8 8H18a2 2 0 110 4h-5.2L8 20H6l2.4-8z"/>
                            </svg>
                        </div>
                        <div className="text-3xl font-semibold">
                            {outboundFlights[0]?.arrival_airport?.city || "Arrival"}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow flex justify-between">
                        <div className="p-6">
                            <p className="text-center">FL1001</p>
                            <p className="px-4 text-2xl font-bold">10:35 -------------╰┈➤------------- 22:20</p>
                            <div className="flex w-full justify-between">
                                <div className="text-sm font-semibold text-left text-gray-500">
                                    <p>Sân bay {outboundFlights[0]?.departure_airport?.name}</p>
                                    <p className="pl-8">{outboundFlights[0].departure_airport_id}</p>
                                </div>
                                <div className="text-sm font-semibold text-right text-gray-500">
                                    <p>Sân bay Cần Thơ</p>
                                    <p className="pr-8">VCA</p>
                                </div>
                            </div>
                            <p className="text-md text-center text-gray-500">⏱ Thời gian bay 10h45'</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div
                                className="text-center p-5 flex flex-col space-y-2 rounded w-full h-full bg-blue-400 relative">
                                <p className="font-bold text-white text-lg">Phổ thông</p>
                                <hr className="w-32"/>
                                <p className="font-bold whitespace-nowrap">600,000 VND</p>
                                <i className="text-sm text-white">Còn 80/80 ghế</i>
                                <button
                                    className="absolute bottom-4 right-11 lg:hover:scale-110 text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-md">
                                    LỰA CHỌN
                                </button>
                            </div>
                            <div
                                className="relative space-y-2 text-center flex flex-col p-5 rounded w-full h-full bg-yellow-300">
                                <p className="font-bold text-red-700 text-lg">Thương gia</p>
                                <hr className="border-red-500 w-32"/>
                                <p className="font-bold whitespace-nowrap">1,023,000 VND</p>
                                <i className="text-sm text-red-500">Còn 120/120 ghế</i>
                                <button
                                    className="absolute bottom-4 right-11 text-xs lg:hover:scale-110 font-bold text-white bg-green-600 px-2 py-1 rounded-md">
                                    LỰA CHỌN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{flex: 3}}>
                <BookingInfo outboundFlight={[]} returnFlight={[]} tripType={tripType} passengers={passengers}/>
            </div>
        </div>
    );
}

function FlightCard({ flight, onSelect }) {
    return (
        <div>
            <div className="bg-white rounded-lg shadow flex justify-between">
                <div className="p-6">
                    <p className="text-center">{flight.number}</p>
                    <p className="px-4 text-2xl font-bold">{new Date(flight.departure_time).toLocaleString()} -------------╰┈➤------------- {new Date(flight.arrival_time).toLocaleString()}</p>
                    <div className="flex w-full justify-between">
                        <div className="text-sm font-semibold text-left text-gray-500">
                            <p>Sân bay {flight?.departure_airport?.name}</p>
                            <p className="pl-8">{flight.departure_airport_id}</p>
                        </div>
                        <div className="text-sm font-semibold text-right text-gray-500">
                            <p>Sân bay {flight?.arrival_airport?.name}</p>
                            <p className="pr-8">{flight.arrival_airport_id}</p>
                        </div>
                    </div>
                    <p className="text-md text-center text-gray-500">⏱ Thời gian bay {flightDuration(flight.departure_time, flight.arrival_time)}</p>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="text-center p-5 rounded w-full h-full bg-blue-400 relative">
                        <p className="font-bold text-red-700 text-lg pb-2">Phổ thông</p>
                        <p className="font-bold">600,000 VND</p>
                        <button
                            className="absolute bottom-4 right-8 lg:hover:scale-110 text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-md">
                            LỰA CHỌN
                        </button>
                    </div>
                    <div className="relative text-center p-5 rounded w-full h-full bg-yellow-300">
                        <p className="font-bold text-purple-500 text-lg pb-2">Thương gia</p>
                        <p className="font-bold">1,023,000 VND</p>
                        <button
                            className="absolute bottom-4 right-8 text-xs lg:hover:scale-110 font-bold text-white bg-green-600 px-2 py-1 rounded-md">
                            LỰA CHỌN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function flightDuration(departure_time, arrival_time) {
    const arrival = new Date(arrival_time);
    const departure = new Date(departure_time);
    const durationMs = arrival - departure;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes}'`;
}

export default FlightSelection;