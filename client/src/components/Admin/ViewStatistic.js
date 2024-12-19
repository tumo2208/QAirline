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
        <div>
            <div style={{width: "80%", margin: "0 auto"}}>
                <h2>Doanh thu theo tháng</h2>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
                    <button onClick={handlePreviousYear} disabled={currentYear <= 2024}>
                        ← Năm trước
                    </button>
                    <span>{currentYear}</span>
                    <button onClick={handleNextYear} disabled={currentYear >= new Date().getFullYear()}>
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

            <div>
                <h2>Top 3 Tourist Destinations by Passengers</h2>
                <div>
                    <button onClick={handlePreviousMonth}>← Previous Month</button>
                    <span>
                    {month}/{year}
                </span>
                    <button onClick={handleNextMonth}>Next Month →</button>
                </div>
                <ol>
                    {destinations.map((destination, index) => (
                        <li key={index}>
                            <h3>{destination.city}</h3>
                            {/*<p>Total Passengers: {destination.totalPassengers}</p>*/}
                        </li>
                    ))}
                </ol>
            </div>

            <div style={{padding: "20px"}}>
                <h1>Flight Statistics</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Enter Flight ID"
                        value={flightID}
                        onChange={(e) => setFlightID(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                {flightData && (
                    <div>
                        <h2>Flight Details</h2>
                        <p><strong>Flight Number:</strong> {flightData.flight_number}</p>
                        <p><strong>Departure City:</strong> {flightData.departure_city}</p>
                        <p><strong>Arrival City:</strong> {flightData.arrival_city}</p>
                        <p><strong>Departure Time:</strong> {new Date(flightData.departure_time).toLocaleString()}</p>
                        <p><strong>Arrival Time:</strong> {new Date(flightData.arrival_time).toLocaleString()}</p>

                        <div style={{display: "flex", justifyContent: "space-around", marginTop: "20px"}}>
                            <div>
                                <h3>Economy Class</h3>
                                <Pie
                                    data={{
                                        labels: ["Occupied Seats", "Available Seats"],
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
                                />
                            </div>
                            <div>
                                <h3>Business Class</h3>
                                <Pie
                                    data={{
                                        labels: ["Occupied Seats", "Available Seats"],
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
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewStatistic;