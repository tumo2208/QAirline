import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function Destination() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const response = await axios.post("http://localhost:3001/api/post/listPost", {
                    category: "destination",
                });
                setDestinations(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching destinations:", err);
                setError("Có lỗi xảy ra khi lấy dữ liệu!");
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center mb-8">Điểm đến thú vị</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination) => (
                    // <div
                    //     key={destination.id}
                    //     className="relative block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    // >
                    <Link
                        key={destination.id}
                        to={`/destination/${destination.id}`}
                        className="relative block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        // className="bg-white rounded-lg shadow-md overflow-hidden block"
                    >
                        <img
                            src={destination.thumbnail}
                            alt={destination.title}
                            className="w-full h-56 object-cover transition-all duration-300 transform hover:brightness-75"
                        />
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <h2 className="text-white text-lg font-semibold">
                                {destination.title}
                            </h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Destination;
