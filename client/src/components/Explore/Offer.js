import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

function Offer() {
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

    return (
        <div className="py-10 justify-center items-center" style={{backgroundImage: "url('https://wallpapercat.com/w/full/3/b/d/21204-1920x1200-desktop-hd-clouds-background-photo.jpg')"}}>
            <div className="bg-sky-200 max-w-6xl flex flex-col mx-auto justify-center rounded-2xl shadow-lg border-4 p-5 w-full">
                <h1 className="text-5xl pb-5 font-bold text-center text-[#002D74]">Ưu Đãi</h1>
                <div className="max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-12 mx-auto">
                {offers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
                </div>
            </div>
        </div>
    );
}

function OfferCard({ offer }) {
    return (
        <div
            key={offer.id}
            className="bg-white rounded-lg shadow-md overflow-hidden mx-auto"
        >
            <img
                src={offer.thumbnail}
                alt={offer.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 flex items-center justify-between space-x-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2">{offer.title}</h2>
                    <p className="text-gray-600">{offer.content}</p>
                </div>
                <Link
                    to={`/offer/${offer.id}`}
                    className="text-blue-500 font-medium hover:underline whitespace-nowrap"
                >
                    Chi Tiết
                </Link>
            </div>
        </div>
    );
}


export default Offer;
