import React, { useState } from "react";
import axios from "axios";

function AddAircraft() {
  const [formData, setFormData] = useState({
    aircraftNumber: "",
    manufacturer: "",
    seatNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/airportAircraft/addAircraft`,formData, { withCredentials: true });

      if (response.status === 200) {
        setSuccess(response.data);
        setFormData({
          aircraftNumber: "",
          manufacturer: "",
          seatNumber: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Lỗi thêm máy bay", error);
      setError(error.response?.data?.error || "Lỗi thêm máy bay");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Thêm máy bay</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Số hiệu máy bay</label>
            <input
              type="text"
              name="aircraftNumber"
              value={formData.aircraftNumber}
              onChange={handleChange}
              placeholder="Enter aircraft number"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Nhà sản xuất</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Enter manufacturer name"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Số chỗ ngồi</label>
            <input
              type="number"
              name="seatNumber"
              value={formData.seatNumber}
              onChange={handleChange}
              placeholder="Enter seat number"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Thêm máy bay
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAircraft;
