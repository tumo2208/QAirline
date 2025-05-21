import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddFlight() {
    const [formData, setFormData] = useState({
        flightID: "",
        aircraftID: "",
        departureAirportID: "",
        arrivalAirportID: "",
        departureTime: "",
        arrivalTime: "",
        priceEconomy: "",
        priceBusiness: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedDepartureTime = `${formData.departureTime}:00.000+00:00`;
        const formattedArrivalTime = `${formData.arrivalTime}:00.000+00:00`;

        const payload = {
            ...formData,
            departureTime: formattedDepartureTime,
            arrivalTime: formattedArrivalTime,
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/flights/addflight`, payload, { withCredentials: true });
            if (response.status === 200) {
                setSuccess(response.data);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            console.error("Lỗi thêm máy bay", error);
            setError(error.response?.data?.error || "Lỗi thêm máy bay");
            setTimeout(() => setError(""), 3000);
        }
    }

    return (
        <div className="flight-form-container">
            <div
                className="relative w-full mx-auto flex items-center justify-center bg-center bg-cover"
                style={{
                    backgroundImage:
                        "url('https://lindaontherun.com/wp-content/uploads/2021/07/How-to-avoid-getting-sick-on-a-plane-flying.jpg')",
                }}
            >
                <div className="bg-gray-100 p-10 my-14 mx-auto flex rounded-2xl shadow-lg max-w-3xl">
                    <div className="px-5 w-full mx-auto">
                        {success && <p className="text-green-500">{success}</p>}
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                        <h2 className="text-3xl font-bold text-[#002D74]">Thông tin chuyến bay</h2>

                        <form className="mt-6 space-y-4 flex flex-col" onSubmit={handleSubmit}>
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700">Mã chuyến bay</label>
                                <input
                                    type="text"
                                    name="flightID"
                                    value={formData.flightID}
                                    onChange={handleChange}
                                    placeholder="Nhập mã chuyến bay"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="font-semibold block text-gray-700">Mã máy bay</label>
                                <input
                                    type="text"
                                    name="aircraftID"
                                    value={formData.aircraftID}
                                    onChange={handleChange}
                                    placeholder="Nhập mã máy bay"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="flex flex-row space-x-4">
                                <div className="flex-1">
                                    <label className="font-semibold block text-gray-700">
                                        Mã sân bay đi
                                    </label>
                                    <input
                                        type="text"
                                        name="departureAirportID"
                                        value={formData.departureAirportID}
                                        onChange={handleChange}
                                        placeholder="Nhập mã sân bay"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="font-semibold block text-gray-700">
                                        Mã sân bay đến
                                    </label>
                                    <input
                                        type="text"
                                        name="arrivalAirportID"
                                        value={formData.arrivalAirportID}
                                        onChange={handleChange}
                                        placeholder="Nhập mã sân bay"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex lg:flex-row md:flex-row flex-col lg:space-x-4 md:space-x-4 space-y-4 md:space-y-0 lg:space-y-0">
                                <div className="flex-1">
                                    <label className="font-semibold block text-gray-700">Thời gian cất cánh</label>
                                    <input
                                        type="datetime-local"
                                        name="departureTime"
                                        value={formData.departureTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="font-semibold block text-gray-700">Thời gian hạ cánh</label>
                                    <input
                                        type="datetime-local"
                                        name="arrivalTime"
                                        value={formData.arrivalTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row space-x-4">
                                <div className="flex-1">
                                    <label className="font-semibold block text-gray-700">
                                        Giá ghế (Economy)
                                    </label>
                                    <input
                                        type="number"
                                        name="priceEconomy"
                                        value={formData.priceEconomy}
                                        onChange={handleChange}
                                        placeholder="Enter price for economy"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="font-semibold block text-gray-700">
                                        Giá ghế (Business)
                                    </label>
                                    <input
                                        type="number"
                                        name="priceBusiness"
                                        value={formData.priceBusiness}
                                        onChange={handleChange}
                                        placeholder="Enter price for business"
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full text-lg block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                            >
                                Thêm chuyến bay
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFlight;