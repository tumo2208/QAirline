import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    ArcElement
} from 'chart.js';
import axios from "axios";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    ArcElement
);

function ViewStatistic() {
    /**
     * Biểu đồ doanh thu
     */
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    const fetchData = async (year) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/statistic/monthlyRevenue/${year}`, {
                withCredentials: true
            });
            const data = await response.data;

            const labels = data.map((item) => `Tháng ${item.month}`);
            const revenues = data.map((item) => item.totalRevenue);

            setChartData({
                labels,
                datasets: [
                    {
                        label: `Doanh thu`,
                        data: revenues,
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching revenue: ', error);
        }

    };

    // Fetch data whenever `currentYear` changes
    useEffect(() => {
        fetchData(currentYear);
    }, [currentYear]);

    // Event handlers for navigation
    const handlePreviousYear = () => {
        if (currentYear > 2024) setCurrentYear(currentYear - 1);
    };

    const handleNextYear = () => {
        if (currentYear < new Date().getFullYear()) setCurrentYear(currentYear + 1);
    };

    /**
     * Top 3 địa điểm thu hút khách du lịch
     */
    const [destinations, setDestinations] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const fetchTopDestinations = async (month, year) => {
        try {
            const response = await axios.post('http://localhost:3001/api/statistic/topDestination', {
                month: month,
                year: year
            }, {
                withCredentials: true
            });
            setDestinations(response.data);
        } catch (error) {
            console.error('Error fetching top destinations:', error);
        }
    };

    useEffect(() => {
        fetchTopDestinations(month, year);
    }, [month, year]);

    const handlePreviousMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear((prev) => prev - 1);
        } else {
            setMonth((prev) => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear((prev) => prev + 1);
        } else {
            setMonth((prev) => prev + 1);
        }
    };


    /**
     * Biểu đồ từng chuyến bay
     */
    const [flightID, setFlightID] = useState("");
    const [flightData, setFlightData] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.post("http://localhost:3001/api/statistic/flightDetail", {
                flightID,
            }, {
                withCredentials: true
            });
            setFlightData(response.data);
        } catch (err) {
            console.error(err);
            setFlightData(null);
        }
    };

    return (
        <div className="py-10 mx-auto max-w-6xl flex flex-col items-center space-y-10">
            <h2 className="text-5xl font-bold text-center text-[#002D74]">Thống kê</h2>
            <div className="w-full space-y-5">
                <h2 className="text-3xl font-bold">Doanh thu theo tháng</h2>
                <div className="flex flex-row w-full space-x-10 items-center justify-center text-sm">
                    <button className="bg-blue-500 select-none hover:bg-blue-700 text-white py-2 px-4 rounded-full" onClick={handlePreviousYear} disabled={currentYear <= 2024}>
                        ← Năm trước
                    </button>
                    <span className="text-blue-800 text-2xl font-semibold">{currentYear}</span>
                    <button className="bg-blue-500 select-none hover:bg-blue-700 text-white py-2 px-4 rounded-full" onClick={handleNextYear} disabled={currentYear >= new Date().getFullYear()}>
                        Năm sau →
                    </button>
                </div>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {display: true, position: "top"},
                            title: {display: true, text: `Doanh thu năm ${currentYear}`},
                        },
                        scales: {
                            x: {
                                type: "category", // Scale cho trục x
                                title: {display: true, text: "Tháng"}
                            },
                            y: {
                                type: "linear", // Scale cho trục y
                                title: {display: true, text: "Doanh thu (VNĐ)"}
                            },
                        },
                    }}
                />
            </div>

            <div className="mx-auto w-full space-y-5">
                <h1 className="text-3xl font-bold">Thống kê về chuyến bay</h1>
                <div
                    className="flex rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                    <input type="text"
                        placeholder="Nhập mã chuyến bay"
                        value={flightID}
                        onChange={(e) => setFlightID(e.target.value)}
                        className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3"/>
                    <button type='button' className="flex items-center justify-center bg-[#007bff] px-5"
                            onClick={handleSearch}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                                className="fill-white hover:scale-125">
                            <path
                                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                            </path>
                        </svg>
                    </button>
                </div>
                
                {flightData && (
                    <div className="text-center max-w-5xl mx-auto">
                        <p><strong>Mã chuyến bay:</strong> {flightData.flight_number}</p>
                        <p><strong>Điểm khởi hành:</strong> {flightData.departure_city}</p>
                        <p><strong>Điểm đến:</strong> {flightData.arrival_city}</p>
                        <p><strong>Thời gian khởi hành:</strong> {new Date(flightData.departure_time).toLocaleString()}</p>
                        <p><strong>Thời gian hạ cánh:</strong> {new Date(flightData.arrival_time).toLocaleString()}</p>

                        <div className="flex flex-col lg:flex-row md:flex-row justify-center gap-x-20 w-full mt-5">
                            <div className="space-y-2 flex-shrink-0 w-[300px]">
                                <h3 className="text-center font-semibold text-lg">Hạng Phổ thông</h3>
                                <div className="w-full h-64 flex items-center justify-center">
                                <Pie
                                    data={{
                                    labels: ["Số ghế đã đặt", "Số ghế trống"],
                                    datasets: [
                                        {
                                        data: [
                                            flightData.economyPassengers,
                                            flightData.economySeats - flightData.economyPassengers,
                                        ],
                                        backgroundColor: ["#FF6384", "#36A2EB"],
                                        },
                                    ],
                                    }}
                                    options={{ maintainAspectRatio: false }}
                                />
                                </div>
                            </div>
                            <div className="space-y-2 flex-shrink-0 w-[300px]">
                                <h3 className="text-center font-semibold text-lg">Hạng Thương gia</h3>
                                <div className="w-full h-64 flex items-center justify-center">
                                <Pie
                                    data={{
                                    labels: ["Số ghế đã đặt", "Số ghế trống"],
                                    datasets: [
                                        {
                                        data: [
                                            flightData.businessPassengers,
                                            flightData.businessSeats - flightData.businessPassengers,
                                        ],
                                        backgroundColor: ["#FF6384", "#36A2EB"],
                                        },
                                    ],
                                    }}
                                    options={{ maintainAspectRatio: false }}
                                />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mx-auto w-full space-y-5">
                <h2 className="text-3xl font-bold">Top 3 điểm đến nổi bật nhất</h2>
                <div className="flex flex-row w-full space-x-10 items-center justify-center text-sm">
                    <button className="bg-blue-500 select-none hover:bg-blue-700 text-white py-2 px-4 rounded-full" onClick={handlePreviousMonth}>← Tháng trước</button>
                    <span className="text-2xl text-blue-800 font-semibold">
                        {month}/{year}
                    </span>
                    <button className="bg-blue-500 select-none hover:bg-blue-700 text-white py-2 px-4 rounded-full" onClick={handleNextMonth}>Tháng sau →</button>
                </div>
                <ol className="text-center text-2xl space-y-5 font-semibold">
                    {destinations.map((destination, index) => (
                        <li key={index}>
                            {index === 0 && "🥇"}
                            {index === 1 && "🥈"}
                            {index === 2 && "🥉"}
                            <span> {destination.city}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default ViewStatistic;