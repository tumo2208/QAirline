import BookingInfo from "./BookingInfo";
import React from "react";
import {useLocation, useNavigate} from "react-router-dom";

function Passengers() {
    const { state } = useLocation();
    const { outboundFlight, returnFlight , tripType, passengers } = state;
    const navigate = useNavigate();

    return (
        <div className="bg-gray-100 flex">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link
                href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lilita+One&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                rel="stylesheet"/>
            <div style={{flex: 7}}>
                <div className="sticky top-20 z-20 bg-yellow-100 p-6 rounded-lg shadow-lg mb-6">
                    <div className="justify-center text-center text-3xl font-semibold"
                         style={{fontFamily: "Barlow Condensed"}}>
                        Thông tin khách hàng
                    </div>
                </div>
                <div className="p-6 bg-white border border-gray-300 rounded-md shadow-md max-w-lg mx-auto">
                    <h2 className="text-lg font-bold mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 4.354a4 4 0 100 15.292 4 4 0 000-15.292z"/>
                        </svg>
                        Người lớn
                    </h2>

                    <div className="flex items-center mb-4">
                        <label className="mr-4 flex items-center">
                            <input type="radio" name="gender" className="mr-2"/> Nam
                        </label>
                        <label className="mr-4 flex items-center">
                            <input type="radio" name="gender" className="mr-2"/> Nữ
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="gender" className="mr-2"/> Khác
                        </label>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Họ*</label>
                            <input type="text" placeholder="Vui lòng nhập họ"
                                   className="w-full mt-1 p-2 border border-red-500 rounded-md"/>
                            <p className="text-xs text-red-500">Vui lòng nhập họ</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên đệm & tên*</label>
                            <input type="text" placeholder="Vui lòng nhập tên đệm & tên"
                                   className="w-full mt-1 p-2 border border-red-500 rounded-md"/>
                            <p className="text-xs text-red-500">Vui lòng nhập tên đệm và tên</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ngày sinh* (DD/MM/YYYY)</label>
                            <input type="date" className="w-full mt-1 p-2 border border-red-500 rounded-md"/>
                            <p className="text-xs text-red-500">Vui lòng chọn ngày sinh</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quốc gia*</label>
                            <select className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                                <option>Việt Nam</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại*</label>
                            <div className="flex items-center">
                                <span
                                    className="inline-flex items-center px-3 border border-gray-300 bg-gray-50 text-gray-700">+84</span>
                                <input type="text" placeholder="Vui lòng nhập số điện thoại"
                                       className="flex-1 p-2 border border-red-500 rounded-md"/>
                            </div>
                            <p className="text-xs text-red-500">Vui lòng nhập số điện thoại</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email*</label>
                            <input type="email" placeholder="Vui lòng nhập email"
                                   className="w-full mt-1 p-2 border border-red-500 rounded-md"/>
                            <p className="text-xs text-red-500">Vui lòng nhập email</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">CCCD / Passport</label>
                            <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nơi ở hiện tại</label>
                            <input type="text" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{flex: 3}}>
                <BookingInfo outboundFlight={outboundFlight} returnFlight={returnFlight} tripType={tripType}
                             passengers={passengers}/>
            </div>
        </div>
    )
}

export default Passengers;