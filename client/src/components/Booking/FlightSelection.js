import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingInfo from "./BookingInfo";
import axios from "axios";

function FlightSelection() {
    const location = useLocation();
    const { state } = location;
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const { tripType, passengers, searchInfo } = state;
    const navigate = useNavigate();

    const [showOutbound, setShowOutbound] = useState(true);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);

    const [selectedDate, setSelectedDate] = useState(searchInfo.departDate);
    const [selectedArrivalDate, setSelectedArrivalDate] = useState(searchInfo.arriveDate);

    const [outboundFlights, setOutboundFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);

    // fetch flights when selectedDate changed
    const fetchFlights = async () => {
        try {
            const reqBody = {
                departCity: searchInfo.departCity,
                arriveCity: searchInfo.arriveCity,
                departDate: selectedDate,
            };
            const response = await axios.post(`http://${process.env.REACT_APP_API_URL}:3001/api/flights/oneway`, reqBody);
            setOutboundFlights(response.data);
        } catch (err) {
            console.error("Error fetching flights:", err);
            setOutboundFlights([]);
        }

    };

    useEffect(() => {
        fetchFlights();
    }, [selectedDate]);

    const fetchArrivalFlights = async () => {
        try {
            const reqBody = {
                departCity: searchInfo.arriveCity,
                arriveCity: searchInfo.departCity,
                departDate: selectedArrivalDate,
            };
            const response = await axios.post(`http://${process.env.REACT_APP_API_URL}:3001/api/flights/oneway`, reqBody);
            setReturnFlights(response.data);
        } catch (err) {
            console.error("Error fetching flights:", err);
            setReturnFlights([]);
        }

    };

    useEffect(() => {
        fetchArrivalFlights();
    }, [selectedArrivalDate]);

    const outboundCost = selectedOutbound?.flight?.available_seats.find(seat => seat.class_type === selectedOutbound.classType)?.price || 0;
    const returnCost = selectedReturn?.flight?.available_seats.find(seat => seat.class_type === selectedReturn.classType)?.price || 0;

    const totalCost = (outboundCost + returnCost) * (passengers.adults + passengers.children + 0.1 * passengers.infants);

    // gen 5 date which selectedDate is in middle
    const generateDateList = () => {
        const dates = [];
        for (let i = -2; i <= 2; i++) {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() + i);
            if (date >= new Date()) {
                dates.push({
                    day: date.toLocaleDateString("vi-VN", { weekday: "long" }),
                    date: date.getDate(),
                    month: date.getMonth() + 1,
                    fullDate: new Date(date),
                });
            }
        }
        return dates;
    };

    const generateArrivalDateList = () => {
        const dates = [];
        for (let i = -2; i <= 2; i++) {
            const date = new Date(selectedArrivalDate);
            date.setDate(date.getDate() + i);
            if (date > new Date(selectedDate)) {
                dates.push({
                    day: date.toLocaleDateString("vi-VN", { weekday: "long" }),
                    date: date.getDate(),
                    month: date.getMonth() + 1,
                    fullDate: new Date(date),
                });
            }
        }
        return dates;
    };

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
        if (outboundFlights[0].departure_time > returnFlights[0].departure_time) {
            alert("Chuyến bay đi phải trước chuyến bay về");
            return;
        }
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
            <div className="bg-gray-100 flex flex-col lg:flex-row">
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lilita+One&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                    rel="stylesheet"/>
                <div className="max-w-5xl mx-8 py-8"
                     style={{flex: 7}}>
                    {showOutbound ? (
                        <div>
                            <div className="sticky top-20 z-8 bg-sky-200 p-6 rounded-lg shadow-lg mb-6">
                                <div className="flex items-center justify-between"
                                     style={{fontFamily: "Barlow Condensed"}}>
                                    <div className="lg:flex flex-col whitespace-nowrap hidden items-center justify-center">
                                        <div className="text-2xl font-semibold">
                                            📅 Ngày
                                        </div>
                                        <p className="text-lg">{convertDateFormat(selectedDate)}</p>
                                    </div>
                                    <div className="flex items-center justify-center mx-auto space-x-4">
                                        <div className="text-3xl font-bold">
                                            {searchInfo.departCity}
                                        </div>
                                        <div className="lg:px-10 sm:px-5 text-blue-600">
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
                                            {searchInfo.arriveCity}
                                        </div>
                                    </div>
                                    <div className="lg:flex flex-col hidden whitespace-nowrap items-center justify-center">
                                        <div className="text-2xl font-semibold">
                                            👫 Số hành khách
                                        </div>
                                        <p className="text-lg">{passengers.adults + passengers.children + passengers.infants}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-4 my-4">
                                {generateDateList().map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => { setSelectedDate(item.fullDate)}}
                                        className={`cursor-pointer px-4 py-2 rounded-lg text-center ${
                                            item.fullDate.toDateString() === new Date(selectedDate).toDateString()
                                                ? "bg-yellow-400 text-red-600 font-bold"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        <div className="text-sm whitespace-nowrap md:text-base lg:text-base">{item.day}</div>
                                        <div className="text-sm md:text-base lg:text-base">
                                            {item.date} <span className="hidden md:inline lg:inline">tháng</span> <span className="md:hidden lg:hidden">/</span> {item.month}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {outboundFlights.length !== 0 ? (
                                <div className="space-y-4">
                                    {outboundFlights.map((flight) => (
                                        <FlightCard flight={flight} onSelect={handleSelect}/>
                                    ))}
                                </div>
                            ) : (
                                <h2 className="text-4xl mx-auto max-w-3xl font-bold text-center text-[#002D74] mt-10">Rất tiếc, không có
                                    chuyến bay phù hợp với tìm kiếm của bạn</h2>
                            )}

                        </div>
                    ) : (
                        <div>
                            <div className="sticky top-20 z-8 bg-sky-200 p-6 rounded-lg shadow-lg mb-6">
                                <div className="flex items-center justify-between"
                                     style={{fontFamily: "Barlow Condensed"}}>
                                    <div
                                        className="lg:flex flex-col whitespace-nowrap hidden items-center justify-center">
                                        <div className="text-2xl font-semibold">
                                            📅 Ngày
                                        </div>
                                        <p className="text-lg">{convertDateFormat(selectedArrivalDate)}</p>
                                    </div>
                                    <div className="flex items-center justify-center mx-auto space-x-4">
                                    <div className="text-3xl font-bold">
                                            {searchInfo.arriveCity}
                                        </div>
                                        <div className="lg:px-10 sm:px-5 text-blue-600">
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
                                            {searchInfo.departCity}
                                        </div>
                                    </div>
                                    <div className="lg:flex flex-col hidden whitespace-nowrap items-center justify-center">
                                        <div className="text-2xl font-semibold">
                                            👫 Số hành khách
                                        </div>
                                        <p className="text-lg">{passengers.adults + passengers.children + passengers.infants}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-4 my-4">
                                {generateArrivalDateList().map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSelectedArrivalDate(item.fullDate)
                                        }}
                                        className={`cursor-pointer px-4 py-2 rounded-lg text-center ${
                                            item.fullDate.toDateString() === new Date(selectedArrivalDate).toDateString()
                                                ? "bg-yellow-400 text-red-600 font-bold"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        <div className="text-sm whitespace-nowrap md:text-base lg:text-base">{item.day}</div>
                                        <div className="text-sm md:text-base lg:text-base">
                                            {item.date} <span className="hidden md:inline lg:inline">tháng</span> <span className="md:hidden lg:hidden">/</span> {item.month}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {returnFlights.length !== 0 ? (
                                <div className="space-y-4">
                                    {returnFlights.map((flight) => (
                                        <FlightCard flight={flight} onSelect={handleSelect}/>
                                    ))}
                                </div>
                            ) : (
                                <h2 className="text-5xl font-bold text-center text-[#002D74] mt-10">Rất tiếc, không có
                                    chuyến bay phù hợp với tìm kiếm của bạn</h2>
                            )}

                        </div>
                    )}
                </div>
                <div
                    style={{flex: 3}}>
                    <BookingInfo outboundFlight={selectedOutbound} returnFlight={selectedReturn} tripType={tripType}
                                 passengers={passengers}/>
                </div>
            </div>
            <div className="sticky bottom-0 z-20 bg-blue-200 py-5 px-0 lg:px-5 md:px-5 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="text-left lg:mx-8 md:mx-8 mx-4 ">
                        <button
                            type="button"
                            className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                            onClick={() => handleBack()}
                        >
                            <span className="mr-2 font-bold lg:text-lg md:text-lg text-xs">←</span>
                            Quay lại
                        </button>
                    </div>
                    <div className="flex items-center justify-center ">
                        <div className="text-center lg:mx-8 md:mx-8 mx-4">
                            <p className="font-bold lg:text-2xl md:text-2xl text-lg"
                               style={{fontFamily: "Barlow Condensed"}}>Tổng chi phí</p>
                            <p className="font-bold text-red-700 lg:text-lg md:text-lg text-md">{new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "VND"
                            }).format(totalCost)}</p>
                        </div>
                        <div className="text-right lg:mx-8 md:mx-8 mx-4 ">
                            <button
                                type="button"
                                className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                                onClick={() => handleNext()}
                            >
                                Tiếp theo
                                <span className="ml-2 font-bold lg:text-lg md:text-lg text-xs">→</span>
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
            <div className="bg-white rounded-lg shadow flex flex-col lg:flex-row md:flex-row justify-between">
                <div className="px-6 py-10 flex flex-row space-x-4 justify-between lg:w-full">
                    <div className="text-center lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
                        <p className="px-4 text-2xl font-bold">{new Date(flight.departure_time).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        })} </p>
                        <div className="text-sm font-semibold text-center text-gray-500">
                            <p>Sân bay {flight?.departure_airport?.name}</p>
                            <p>{flight.departure_airport_id}</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <p className="text-center">{flight.flight_number}</p>
                        <div className="flex items-center text-2xl mb-2">
                            <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
                            <div
                                className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
                            ╰┈➤
                            <div
                                className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
                            <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
                        </div>
                        <p className="text-md text-center text-gray-500">⏱ Thời gian bay {flightDuration(flight.departure_time, flight.arrival_time)}</p>
                    </div>
                    <div className="text-center lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
                        <p className="px-4 text-2xl font-bold">{new Date(flight.arrival_time).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}</p>
                        <div className="text-sm font-semibold text-gray-500">
                            <p>Sân bay {flight?.arrival_airport?.name}</p>
                            <p>{flight.arrival_airport_id}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center lg:w-2/3 md:w-1/2 sm:w-full justify-between space-x-2 whitespace-nowrap">
                    <div
                        className="text-center w-1/2 min-w-40 p-5 flex flex-col space-y-3 rounded h-full bg-blue-400">
                        <p className="font-bold text-white text-lg">Phổ thông</p>
                        <hr className="w-full"/>
                        <p className="font-bold whitespace-nowrap">{new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "VND"
                        }).format(flight.available_seats[0]?.price)}</p>
                        <i className="text-sm text-white">Còn {flight.available_seats[0]?.seat_count} ghế</i>
                        {flight.available_seats[0]?.seat_count > 0 && (
                            <button
                            className="hover:scale-110 text-xs font-bold text-white bg-green-500 mx-auto px-2 py-1 rounded-md"
                            onClick={() => onSelect(flight, "Economy")}>
                            LỰA CHỌN
                        </button>
                        )}
                    </div>
                    <div
                        className="text-center w-1/2 min-w-40 p-5 flex flex-col space-y-3 rounded h-full bg-yellow-300">
                        <p className="font-bold text-red-700 text-lg">Thương gia</p>
                        <hr className="border-red-500 w-full"/>
                        <p className="font-bold whitespace-nowrap">{new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "VND"
                        }).format(flight.available_seats[1]?.price)}</p>
                        <i className="text-sm text-red-500">Còn {flight.available_seats[1]?.seat_count} ghế</i>
                        {flight.available_seats[1]?.seat_count > 0 && (
                            <button
                            className="text-xs lg:hover:scale-110 font-bold text-white bg-green-500 px-2 py-1 mx-auto rounded-md"
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