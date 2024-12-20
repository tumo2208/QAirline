import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Loading from '../../shared/Loading';
import {AutocompleteInput} from "../../shared/AutoComplete";
import FetchAirportInfo from "../../shared/AirportInfo";

function HomePage() {
    const [activeTab, setActiveTab] = useState("byPlace");
    const navigate = useNavigate();
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [flightID, setFlightID] = useState("");
    const [loading, setLoading] = useState(false);
    const [placeResults, setPlaceResults] = useState([]);
    const [dateResults, setDateResults] = useState([]);
    const [flight, setFlight] = useState(null);
    const suggestions = FetchAirportInfo();

    const [placeTotalPages, setPlaceTotalPages] = useState(0);
    const [dateTotalPages, setDateTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    const [activeMenu, setActiveMenu] = useState("searchflight");

    /**
     * Fetches flights by arrival city
     * @param {string} destination Arrival city
     * @returns {Promise<void>}
     */
    const searchByPlace = async () => {
        try {
            setPlaceResults([]);
            setLoading(true);
            const response = await axios.post("http://localhost:3001/api/flights/getFlightByArrival", {
                arrivalCity: destination,
            });
            setPlaceResults(response.data);
            setPlaceTotalPages(Math.ceil(response.data.length / pageSize));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching offers:", error);
            setLoading(false);
        }
    }

    /**
     * Fetches flights by departure date
     * @param {string} departureDate - Departure date in the format "YYYY-MM-DD"
     * @returns {Promise<void>}
     */
    const searchByDate = async () => {
        try {
            setDateResults([]);
            setLoading(true);
            const response = await axios.post("http://localhost:3001/api/flights/getFlightByDepartureTime", {
                departDate: departureDate,
            });
            setDateResults(response.data);
            setDateTotalPages(Math.ceil(response.data.length / pageSize));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching offers:", error);
            setLoading(false);
        }
    }

    /**
     *
     */
    const searchFlight = async() => {
        try {
            setFlight(null);
            setLoading(true);
            const response = await axios.post("http://localhost:3001/api/flights/getFlightByID", {
                flightID: flightID,
            });
            setFlight(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching flights:", error);
            setLoading(false);
        }
    }

    /**
     * Handles pagination by changing the current page number and scrolling to the top of the page.
     * @param {number} pageNumber - The page number to navigate to.
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    /**
     * Renders a list of flight results for the current page.
     * Pagination is applied based on the current page and page size.
     * Each flight is displayed using the FlightCard component.
     *
     * @param {Array} typeResults - The array of flight results to be displayed.
     * @returns {JSX.Element} A JSX element containing the flight results for the current page.
     */
    const renderResults = (typeResults) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const results = typeResults.slice(startIndex, endIndex);
        return (
            <div class="flex mx-auto max-w-5xl py-5 space-y-4 flex-col">
                {results.map((flight) => (
                    <FlightCard flight={flight} onSelect={handleSelect} />
                ))}
            </div>
        );
    };
    

    /**
     * Handles when a flight is selected from the search results.
     * @param {object} flight - The flight object that was selected.
     */
    const handleSelect = (flight) => {
        navigate("/booking", {
                state: {
                    depart: flight.departure_airport?.city,
                    arrival: flight.arrival_airport?.city,
                    departDate: formatDate(flight.departure_time),
                }
            }
        )
    }

    return (
        <div>
            <div className="py-10 justify-center items-center" style={{backgroundImage: "url('https://wallpapercat.com/w/full/3/b/d/21204-1920x1200-desktop-hd-clouds-background-photo.jpg')"}}>
                <div className="bg-gray-100 max-w-6xl flex flex-col mx-auto justify-center rounded-2xl shadow-lg border-4 pb-5 w-full">
                    <div className="flex select-none cursor-pointer justify-between text-white text-center w-full font-bold">
                        <button
                            className={`text-lg rounded-tl-lg w-1/2 py-3 ${
                                activeMenu === "searchflight"
                                    ? "bg-sky-200 text-black"
                                    : "bg-blue-800 text-white"
                            }`}
                            onClick={() => setActiveMenu("searchflight")}
                        >
                            TÌM KIẾM CHUYẾN BAY
                        </button>
                        <button
                            className={`text-lg rounded-tr-lg py-3 w-1/2 ${
                                activeMenu === "followflight"
                                    ? "bg-sky-200 text-black"
                                    : "bg-blue-800 text-white"
                            }`}
                            onClick={() => setActiveMenu("followflight")}
                        >
                            THEO DÕI CHUYẾN BAY
                        </button>
                    </div>
                    {activeMenu === "searchflight" && (
                        <div className="p-5">
                            <h2 className="text-5xl font-bold text-center text-[#002D74]">Tìm kiếm chuyến bay</h2>
                            <div className="flex justify-center items-center space-x-4 m-6">
                                <button
                                    className={`py-2 px-4 rounded-lg font-semibold ${
                                        activeTab === "byPlace"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300 text-gray-800"
                                    }`}
                                    onClick={() =>  {
                                        setActiveTab("byPlace");
                                        setCurrentPage(1);
                                    }}
                                >
                                    Theo điểm đến
                                </button>
                                <button
                                    className={`py-2 px-4 rounded-lg font-semibold ${
                                        activeTab === "byDate"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300 text-gray-800"
                                    }`}
                                    onClick={() => {
                                        setActiveTab("byDate");
                                        setCurrentPage(1);
                                    }}
                                >
                                    Theo ngày bay
                                </button>
                            </div>
                            {activeTab==="byPlace" && (
                                <div>
                                    <div
                                        className="flex rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                                        <AutocompleteInput
                                            suggestions={suggestions}
                                            style={"destination w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"}
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            onlyPlaces={true}
                                        />
                                        <button type='button' className="flex items-center justify-center bg-[#007bff] px-5"
                                                onClick={searchByPlace}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                                                className="fill-white hover:scale-125">
                                                <path
                                                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div>
                                        {placeResults.length > 0 && (
                                            <div>
                                                {renderResults(placeResults)}
                                                <div className="flex justify-center items-center gap-8">
                                                    <button
                                                        className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                            fill="currentColor" className="w-4 h-4">
                                                            <path fill-rule="evenodd"
                                                                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                                                                clip-rule="evenodd"/>
                                                        </svg>
                                                    </button>

                                                    <p className="text-slate-600">
                                                        Trang <strong
                                                        className="text-slate-800">{currentPage}</strong> trên&nbsp;<strong
                                                        className="text-slate-800">{placeTotalPages}</strong>
                                                    </p>

                                                    <button
                                                        className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === placeTotalPages}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                            fill="currentColor" className="w-4 h-4">
                                                            <path fill-rule="evenodd"
                                                                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                                                                clip-rule="evenodd"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            )}
                            {activeTab === "byDate" && (
                                <div>
                                    <div
                                        className="flex rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                                        <input type="date"
                                            value={departureDate}
                                            onChange={(e) => setDepartureDate(e.target.value)}
                                            className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"/>
                                        <button type='button' className="flex items-center justify-center bg-[#007bff] px-5"
                                                onClick={searchByDate}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                                                className="fill-white hover:scale-125">
                                                <path
                                                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div>
                                        {dateResults.length > 0 && (
                                            <div>
                                                {renderResults(dateResults)}
                                                <div className="flex justify-center items-center gap-8">
                                                    <button
                                                        className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                            fill="currentColor" className="w-4 h-4">
                                                            <path fill-rule="evenodd"
                                                                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                                                                clip-rule="evenodd"/>
                                                        </svg>
                                                    </button>

                                                    <p className="text-slate-600">
                                                        Trang <strong
                                                        className="text-slate-800">{currentPage}</strong> trên&nbsp;<strong
                                                        className="text-slate-800">{dateTotalPages}</strong>
                                                    </p>

                                                    <button
                                                        className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === dateTotalPages}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                            fill="currentColor" className="w-4 h-4">
                                                            <path fill-rule="evenodd"
                                                                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                                                                clip-rule="evenodd"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeMenu === "followflight" && (
                        <div className="p-5">
                            <h2 className="text-5xl font-bold text-center text-[#002D74]">Theo dõi chuyến bay</h2>
                            <div className="mt-6">
                                <div
                                    className="flex rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                                    <input type="text" placeholder="Nhập mã chuyến bay"
                                        value={flightID}
                                        onChange={(e) => setFlightID(e.target.value)}
                                        className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"/>
                                    <button type='button' className="flex items-center justify-center bg-[#007bff] px-5"
                                            onClick={searchFlight}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                                            className="fill-white hover:scale-125">
                                            <path
                                                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5">
                                    {flight ? <FlightCardOther flight={flight}></FlightCardOther> : 
                                    <div>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {loading && <Loading/>}
        </div>
    )
}

/**
 * A component that renders a card for a flight
 * @param {{flight: Object, onSelect: Function}} props
 * @param {Object} props.flight - The flight object
 * @param {Function} props.onSelect - The function to call when the card is clicked
 * @returns {ReactElement} The component
 */
function FlightCard({flight, onSelect}) {
    return (
        <div>
            <div className="bg-white w-full rounded-lg shadow-lg px-6 py-6 md:py-0 lg:py-0 flex lg:flex-row md:flex-row flex-col items-center space-x-10 justify-between border-2">
                <div className="flex items-center w-full">
                    <div className="flex flex-col mr-6 h-full space-y-1">
                        <div className="text-center text-green-500 text-lg font-semibold whitespace-nowrap">Ngày bay</div>
                        <div className="text-center whitespace-nowrap">{convertDateFormat(flight.departure_time)}</div>
                    </div>
                    <div className="py-10 flex flex-row space-x-2 justify-between w-full">
                        <div className="text-center lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
                            <p className="px-4 text-2xl font-bold">{new Date(flight.departure_time).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            })} </p>
                            <div className="text-sm font-semibold text-center text-gray-500">
                                <p>Sân bay {flight?.departure_airport?.name}</p>
                                <p>{flight.departure_airport?.city}</p>
                            </div>
                        </div>
                        <div className="w-full">
                            <p className="text-center">{flight.flight_number}</p>
                            <div className="flex items-center text-2xl">
                                <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
                                <div
                                    className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
                                ╰┈➤
                                <div
                                    className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
                                <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
                            </div>
                        </div>
                        <div className="text-center lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
                            <p className="px-4 text-2xl font-bold">{new Date(flight.arrival_time).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</p>
                            <div className="text-sm font-semibold text-gray-500">
                                <p>Sân bay {flight?.arrival_airport?.name}</p>
                                <p>{flight.arrival_airport?.city}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:flex flex-col hidden h-full space-y-1">
                    <div className="text-center text-red-500 text-lg font-semibold whitespace-nowrap">Giá vé chỉ từ</div>
                    <div className="text-center whitespace-nowrap"><i>{new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "VND"
                }).format(flight.available_seats[0]?.price)} VND</i></div>
                </div>

                <div>
                    <button
                        type="button"
                        onClick = {() => onSelect(flight)}
                        className="whitespace-nowrap mx-auto items-center text-white py-2.5 px-6 text-sm rounded-lg bg-sky-500 cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-sky-700 hover:scale-110"
                    >
                        ĐẶT VÉ NGAY
                    </button>
                </div>

            </div>
        </div>
    );
}

/**
 * A component that renders a card for a flight
 * @param {{flight: Object, onSelect: Function}} props
 * @param {Object} props.flight - The flight object
 * @returns {ReactElement} The component
 */
function FlightCardOther({flight}) {
    return (
        <div>
            <div
                className="bg-white w-full rounded-lg shadow-lg px-6 py-6 md:py-0 lg:py-0 flex lg:flex-row md:flex-row flex-col items-center space-x-10 justify-between border-2">
                <div className="flex items-center w-full">
                    <div className="flex flex-col mr-6 h-full space-y-1">
                        <div className="text-center text-green-500 text-lg font-semibold whitespace-nowrap">Ngày bay
                        </div>
                        <div className="text-center whitespace-nowrap">{convertDateFormat(flight.departure_time)}</div>
                    </div>
                    <div className="py-10 flex flex-row space-x-2 justify-between w-full">
                        <div className="text-center lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
                            <p className="px-4 text-2xl font-bold">{new Date(flight.departure_time).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })} </p>
                            <div className="text-sm font-semibold text-center text-gray-500">
                                <p>Sân bay {flight?.departure_airport?.name}</p>
                                <p>{flight.departure_airport?.city}</p>
                            </div>
                        </div>
                        <div className="w-full">
                            <p className="text-center">{flight.flight_number}</p>
                            <div className="flex items-center text-2xl">
                                <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
                                <div
                                    className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
                                ╰┈➤
                                <div
                                    className="flex-grow border-t-2 border-zinc-400 border-dotted h-px"></div>
                                <div className="w-3 h-3 rounded-full border-2 border-zinc-900"></div>
                            </div>
                        </div>
                        <div className="text-center lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
                            <p className="px-4 text-2xl font-bold">{new Date(flight.arrival_time).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</p>
                            <div className="text-sm font-semibold text-gray-500">
                                <p>Sân bay {flight?.arrival_airport?.name}</p>
                                <p>{flight.arrival_airport?.city}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-red-500 font-semibold">
                    {flight?.notification?
                    <div>
                        {flight?.notification.slice(-1)[0]}
                    </div>
                    : 
                    <div className="whitespace-nowrap">
                        Không có thông báo !
                    </div>}
                </div>
            </div>
        </div>
    );
}

/**
 * Converts a date in milliseconds to the format DD/MM/YYYY
 * @param {number} timeInput - The date in milliseconds
 * @returns {string} The date in the format DD/MM/YYYY
 */
function convertDateFormat(timeInput) {
    const date = new Date(timeInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

/**
 * Converts a date in milliseconds to the format YYYY-MM-DD
 * @param {number} timeInput - The date in milliseconds
 * @returns {string} The date in the format YYYY-MM-DD
 */
function formatDate(timeInput) {
    const date = new Date(timeInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}


export default HomePage;