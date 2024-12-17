import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
);

function ViewStatistic() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    const fetchData = async (year) => {
        const response = await fetch(`http://localhost:3001/api/statistic/monthlyRevenue/${year}`);
        const data = await response.json();

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

    return (
        <div style={{ width: "80%", margin: "0 auto" }}>
            <h2>Doanh thu theo tháng</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
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
                        legend: { display: true, position: "top" },
                        title: { display: true, text: `Doanh thu năm ${currentYear}` },
                    },
                    scales: {
                        x: {
                            type: "category", // Scale cho trục x
                            title: { display: true, text: "Tháng" }
                        },
                        y: {
                            type: "linear", // Scale cho trục y
                            title: { display: true, text: "Doanh thu (VNĐ)" }
                        },
                    },
                }}
            />
        </div>
    );
}

export default ViewStatistic;