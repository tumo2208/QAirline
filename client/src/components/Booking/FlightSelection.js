import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingInfo from "./BookingInfo";

function FlightSelection() {
    const location = useLocation();
    const { state } = location;
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const { flights, tripType, passengers } = state;
    const navigate = useNavigate();

    const [showOutbound, setShowOutbound] = useState(true);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);

    // Nếu không có chuyến bay phù hợp
    if (!flights) {
        return (
            <div className="bg-white p-60 flex flex-col items-center justify-center space-y-10">
                <h2 className="text-5xl font-bold text-center text-[#002D74]">Rất tiếc, không có chuyến bay phù hợp với tìm kiếm của bạn</h2>
                <div className="text-left mx-8">
                        <button
                            type="button"
                            className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                            onClick={() => window.history.back()}
                        >
                            <span className="mr-2 font-bold text-lg">←</span>
                            Quay lại trang trước
                        </button>
                    </div>
            </div>
        )
    }

    const outboundCost = selectedOutbound?.flight?.available_seats.find(seat => seat.class_type === selectedOutbound.classType)?.price || 0;
    const returnCost = selectedReturn?.flight?.available_seats.find(seat => seat.class_type === selectedReturn.classType)?.price || 0;

    const totalCost = (outboundCost + returnCost) * (passengers.adults + passengers.children + 0.1 * passengers.infants);

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
                flight: flight,
                classType: classType,
            });
        } else {
            setSelectedReturn({
                flight: flight,
                classType: classType,
            });
        }
        alert("Chọn chuyến bay thành công");
    };

    const navigateToPassengers = () => {
        navigate("/booking/passengers", {
            state: {
                outboundFlight: selectedOutbound,
                returnFlight: selectedReturn,
                tripType: tripType,
                passengers: passengers,
            }
        });
    }

    const handleNext = () => {
        if (tripType === "one-way") {
            if (!selectedOutbound) {
                alert("Please select your flight.");
                return;
            }
            navigateToPassengers();
        } else if (tripType === "round-trip") {
            if (showOutbound) {
                if (!selectedOutbound) {
                    alert("Please select your outbound flight.");
                    return;
                }
                setShowOutbound(false);
                window.scrollTo(0, 0);
            } else {
                if (!selectedReturn) {
                    alert("Please select your return flight.");
                    return;
                }
                navigateToPassengers();
            }
        }
    }

    const handleBack = () => {
        if (tripType === "one-way") {
            window.history.back()
        } else if (tripType === "round-trip") {
            if (showOutbound) {
                window.history.back()
            } else {
                setShowOutbound(true);
                window.scrollTo(0, 0);
            }
        }
    };

    return (
        <div>
            <div className="bg-gray-100 flex">
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lilita+One&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                    rel="stylesheet"/>
                <div className="max-w-5xl mx-8 py-8"
                     style={{flex: 7}}>
                    {showOutbound ? (
                        <div>
                            <div className="sticky top-20 z-20 bg-yellow-100 p-6 rounded-lg shadow-lg mb-6">
                                <div className="flex items-center justify-between"
                                     style={{fontFamily: "Barlow Condensed"}}>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-2xl font-semibold">
                                            📅 Ngày
                                        </div>
                                        <p className="text-lg">{convertDateFormat(outboundFlights[0].departure_time)}</p>
                                    </div>
                                    <div className="flex items-center justify-center space-x-4">
                                        <div className="text-3xl font-bold">
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
                                        <div className="text-3xl font-bold">
                                            {outboundFlights[0]?.arrival_airport?.city || "Arrival"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-2xl font-semibold">
                                            👫 Số hành khách
                                        </div>
                                        <p className="text-lg">{passengers.adults + passengers.children + passengers.infants}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {outboundFlights.map((flight) => (
                                    <FlightCard flight={flight} onSelect={handleSelect}/>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="sticky top-20 z-20 bg-yellow-100 p-6 rounded-lg shadow-lg mb-6">
                                <div className="flex items-center justify-between"
                                     style={{fontFamily: "Barlow Condensed"}}>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-2xl font-semibold">
                                            📅 Ngày
                                        </div>
                                        <p className="text-lg">{convertDateFormat(returnFlights[0].arrival_time)}</p>
                                    </div>
                                    <div className="flex items-center justify-center space-x-4">
                                        <div className="text-3xl font-bold">
                                            {returnFlights[0]?.departure_airport?.city || "Depart"}
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
                                        <div className="text-3xl font-bold">
                                            {returnFlights[0]?.arrival_airport?.city || "Arrival"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-2xl font-semibold">
                                            👫 Số hành khách
                                        </div>
                                        <p className="text-lg">{passengers.adults + passengers.children + passengers.infants}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {returnFlights.map((flight) => (
                                    <FlightCard flight={flight} onSelect={handleSelect}/>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div
                    style={{flex: 3}}>
                    <BookingInfo outboundFlight={selectedOutbound} returnFlight={selectedReturn} tripType={tripType}
                                 passengers={passengers}/>
                </div>
            </div>
            <div className="sticky bottom-0 z-20 bg-blue-200 p-5 rounded-lg shadow-lg">
                <div className="flex w-full items-center justify-between">
                    <div className="text-left mx-8">
                        <button
                            type="button"
                            className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                            onClick={() => handleBack()}
                        >
                            <span className="mr-2 font-bold text-lg">←</span>
                            Quay lại
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="text-center mx-8">
                            <p className="font-bold text-2xl"
                               style={{fontFamily: "Barlow Condensed"}}>Tổng chi phí</p>
                            <p className="font-bold text-red-700 text-lg">{new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "VND"
                            }).format(totalCost)}</p>
                        </div>
                        <div className="text-right mx-8">
                            <button
                                type="button"
                                className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                                onClick={() => handleNext()}
                            >
                                Tiếp theo
                                <span className="ml-2 font-bold text-lg">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FlightCard({flight, onSelect}) {
    return (
        <div>
            <div className="bg-white rounded-lg shadow flex justify-between">
                <div className="p-6">
                    <p className="text-center">{flight.flight_number}</p>
                    <p className="px-4 text-2xl font-bold">{new Date(flight.departure_time).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} ---------------╰┈➤--------------- {new Date(flight.arrival_time).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}</p>
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
                    <p className="text-md text-center text-gray-500">⏱ Thời gian
                        bay {flightDuration(flight.departure_time, flight.arrival_time)}</p>
                </div>

                <div className="flex items-center space-x-2">
                <div
                        className="text-center p-5 flex flex-col space-y-2 rounded w-full h-full bg-blue-400 relative">
                        <p className="font-bold text-white text-lg">Phổ thông</p>
                        <hr className="w-32"/>
                        <p className="font-bold whitespace-nowrap">{new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "VND"
                        }).format(flight.available_seats[0]?.price)}</p>
                        <i className="text-sm text-white">Còn {flight.available_seats[0]?.seat_count} ghế</i>
                        {flight.available_seats[0]?.seat_count > 0 && (
                            <button
                            className="absolute bottom-4 right-11 lg:hover:scale-110 text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-md"
                            onClick={() => onSelect(flight, "Economy")}>
                            LỰA CHỌN
                        </button>
                        )}
                    </div>
                    <div
                        className="relative space-y-2 text-center flex flex-col p-5 rounded w-full h-full bg-yellow-300">
                        <p className="font-bold text-red-700 text-lg">Thương gia</p>
                        <hr className="border-red-500 w-32"/>
                        <p className="font-bold whitespace-nowrap">{new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "VND"
                        }).format(flight.available_seats[1]?.price)}</p>
                        <i className="text-sm text-red-500">Còn {flight.available_seats[1]?.seat_count} ghế</i>
                        {flight.available_seats[1]?.seat_count > 0 && (
                            <button
                            className="absolute bottom-4 right-11 text-xs lg:hover:scale-110 font-bold text-white bg-green-600 px-2 py-1 rounded-md"
                            onClick={() => onSelect(flight, "Business")}>
                            LỰA CHỌN
                        </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function convertDateFormat(timeInput) {
    const date = new Date(timeInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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