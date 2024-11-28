import React from "react";

function BookingInfo({ outboundFlight, returnFlight, tripType, passengers }) {
    return (
        <div className="sticky top-20 my-8 mx-16 bg-white">
            <div className="bg-blue-800 text-white text-center font-bold py-2 rounded-t-lg">
                THÔNG TIN ĐẶT CHỖ
            </div>
            <div>
                <div className="bg-gray-100 text-gray-800 mx-3 font-bold py-2 mt-3 px-3 rounded-md">
                    Số hành khách
                </div>
                <div className="text-right space-y-2 text-sm my-3 pr-5">
                    <p>Người lớn x {passengers.adults}</p>
                    {passengers.children > 0 && (
                        <p>Trẻ em x {passengers.children}</p>
                    )}
                    {passengers.infants > 0 && (
                        <p>Trẻ sơ sinh x {passengers.infants}</p>
                    )}
                </div>
            </div>
            <div>
                <div className="bg-purple-100 text-gray-800 font-bold py-2 px-3">
                    Chuyến đi
                </div>
                <div className="px-4 py-2">
                    <div>
                        <div>
                            <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                Mã số chuyến bay
                            </div>
                            <div className="text-right text-sm my-3 pr-5">
                                <p>FL1001</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                            Chặng
                        </div>
                        <div className="text-right text-sm my-3 pr-5">
                            <p>Hà Nội (HAN) &rarr; Cần Thơ (VCA)</p>
                        </div>
                    </div>
                    <div>
                        <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                            Thời gian
                        </div>
                        <div className="text-right text-sm my-3 pr-5">
                            <p>25/11/2024, 10:35 &rarr; 22:30 </p>
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                            Giá vé
                        </div>
                        <div className="flex items-center justify-end space-x-8 text-sm mb-3">
                            <div className="space-y-2">
                                <p>Vé hạng x {passengers.adults}</p>
                                {passengers.infants > 0 && (
                                    <p>Vé trẻ sơ sinh x {passengers.infants}</p>
                                )}
                            </div>
                            <div className="space-y-2 font-semibold">
                                <p>1,120,000 VND</p>
                                {passengers.infants > 0 && (
                                    <p>120,000 VND</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {tripType === "round-trip" && (
                <div>
                    <div className="bg-green-100 text-gray-800 font-bold py-2 px-3">
                        Chuyến về
                    </div>
                    <div className="px-4 py-2">
                        <div>
                            <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                Mã số chuyến bay
                            </div>
                            <div className="text-right text-sm my-3 pr-5">
                                <p>FL1001</p>
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                Chặng
                            </div>
                            <div className="text-right text-sm my-3 pr-5">
                                <p>Hà Nội (HAN) &rarr; Cần Thơ (VCA)</p>
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                Thời gian
                            </div>
                            <div className="text-right text-sm my-3 pr-5">
                                <p>25/11/2024, 10:35 &rarr; 22:30 </p>
                            </div>
                        </div>

                        <div>
                            <div className="bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-md">
                                Giá vé
                            </div>
                            <div className="flex items-center justify-end space-x-8 text-sm mb-3">
                                <div className="space-y-2">
                                    <p>Vé hạng x {passengers.adults}</p>
                                    {passengers.infants > 0 && (
                                        <p>Vé trẻ sơ sinh x {passengers.infants}</p>
                                    )}
                                </div>
                                <div className="space-y-2 font-semibold">
                                    <p>1,120,000 VND</p>
                                    {passengers.infants > 0 && (
                                        <p>120,000 VND</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-blue-800 text-white font-bold py-2 px-4 text-right rounded-b-lg">
                Tổng tiền <span className="text-lg">0 VND</span>
            </div>
        </div>
    )
}

export default BookingInfo;