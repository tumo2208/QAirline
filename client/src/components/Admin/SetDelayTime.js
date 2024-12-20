import React, { useState } from 'react';
import axios from 'axios';

function SetDelayTime() {
    const [formData, setFormData] = useState({
        flightID: '',
        newTime: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/flights/setDelayTime', formData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setSuccess(response.data);
                setError('');
            }
        } catch (error) {
            console.error('Lỗi cập nhật thời gian delay:', error);
            setError(error.response?.data?.error || 'Lỗi cập nhật thời gian delay.');
            setSuccess('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Set Flight Delay Time
                </h2>
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Mã chuyến bay</label>
                        <input
                            type="text"
                            name="flightID"
                            value={formData.flightID}
                            onChange={handleChange}
                            placeholder="Enter Flight ID"
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Thời gian cất cánh mới</label>
                        <input
                            type="datetime-local"
                            name="newTime"
                            value={formData.newTime}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-200 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-lg transition duration-200"
                    >
                        Set Delay Time
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SetDelayTime;
