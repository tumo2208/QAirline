import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Offer() {
    const navigate = useNavigate();

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                const response = await axios.post("http://localhost:3001/api/post/listPost", {
                    category: "offer",
                });
                setOffers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching offers:", error);
                setError("Có lỗi xảy ra khi lấy dữ liệu!");
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (offers.length === 0) {
        return (
            <div className="bg-white p-60 flex flex-col items-center justify-center space-y-10">
                <h2 className="text-5xl font-bold text-center text-[#002D74]">
                    Hiện đang không có ưu đãi nào
                </h2>
                <div className="text-left mx-8">
                    <button
                        type="button"
                        className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                        onClick={() => navigate('/')}
                    >
                        <span className="mr-2 font-bold text-lg">←</span>
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Ưu Đãi</h1>
            <div className="space-y-6">
                {offers.map((offer) => (
                    <div
                        key={offer.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <img
                            src={offer.thumbnail}
                            alt={offer.title}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{offer.title}</h2>
                                <p className="text-gray-600">{offer.content}</p>
                            </div>
                            <Link
                                to={`/offer/${offer.id}`}
                                className="text-blue-500 font-medium hover:underline"
                            >
                                Chi Tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Offer;
