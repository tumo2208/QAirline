import BookingInfo from "./BookingInfo";
import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {nationalities} from "../../shared/SharedData";

function Passengers() {
    const { state } = useLocation();
    const { outboundFlight, returnFlight , tripType, passengers } = state;
    const navigate = useNavigate();

    const handleNext = () => {

    }

    const handleBack = () => {
        window.history.back()
    };

    return (
        <div>
            <div className="bg-gray-100 flex">
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lilita+One&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                    rel="stylesheet"/>
                <div style={{flex: 7}}>
                    <div className="bg-yellow-100 my-5 mx-20 p-6 rounded-lg shadow-lg mb-6">
                        <div className="items-center text-center text-3xl font-semibold"
                             style={{fontFamily: "Barlow Condensed"}}>
                            Thông tin khách hàng
                        </div>
                    </div>
                    <div className="flex flex-col space-y-5 my-5">
                        {Array.from({length: passengers.adults}).map((_, index) => (
                            <AdultCard index={index}/>
                        ))}
                        {Array.from({length: passengers.children}).map((_, index) => (
                            <ChildrenCard index={index}/>
                        ))}
                        {Array.from({length: passengers.infants}).map((_, index) => (
                            <InfantCard index={index}/>
                        ))}
                    </div>
                </div>
                <div style={{flex: 3}}>
                    <BookingInfo outboundFlight={outboundFlight} returnFlight={returnFlight} tripType={tripType}
                                 passengers={passengers}/>
                </div>
            </div>
            <div className="sticky bottom-0 z-20 bg-blue-200 p-5 rounded-lg shadow-lg">
                <div className="flex w-full items-center justify-between">
                    <div className="text-left mx-8">
                        <button
                            type="button"
                            className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                            onClick={() => handleBack()}
                        >
                            <span className="mr-2 font-bold text-lg">←</span>
                            Quay lại
                        </button>
                    </div>
                    <div className="text-right mx-8">
                        <button
                            type="button"
                            className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                            onClick={() => handleNext()}
                        >
                            Tiếp theo
                            <span className="ml-2 font-bold text-lg">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

function AdultCard({index}) {
    return (
        <div className="bg-white border-4 p-10 mx-20 flex rounded-2xl shadow-lg">
            <div className="px-5">
                <h2 className="text-2xl font-bold text-[#002D74]">Người lớn {index + 1}</h2>
                <div className="mt-6 space-y-3 flex flex-col">
                    <div className="flex flex-row space-x-4">
                        <div style={{flex: 2}}>
                            <label className="font-semibold block text-gray-700">Họ và tên (<span className="text-xs">Theo giấy tờ thùy thân</span>)</label>
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder="VD: NGUYEN VAN A"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Giới tính</label>
                            <select required
                                    className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none">
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Others">Khác</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Ngày sinh</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Quốc tịch</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            >
                                {nationalities.map((nation, index) => (
                                    <option key={index} value={nation}>{nation}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Số điện thoại</label>
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder='Nhập số điện thoại'
                                minLength="10"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Email</label>
                            <input
                                type="email"
                                name=""
                                id=""
                                placeholder="VD: example@abc.com"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Loại giấy tờ tùy thân</label>
                            <select required
                                    className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none">
                                <option value="CitizenID">Căn cước công dân</option>
                                <option value="Passport">Hộ chiếu</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Số định danh</label>
                            <input
                                type="text"
                                placeholder="Nhập theo giấy tờ tùy thân"
                                minLength="8"
                                maxLength="15"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Quốc gia cấp</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            >
                                {nationalities.map((nation, index) => (
                                    <option key={index} value={nation}>{nation}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Ngày hết hạn</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChildrenCard({index}) {
    return (
        <div className="bg-white border-4 p-10 mx-20 flex rounded-2xl shadow-lg">
            <div className="px-5">
                <h2 className="text-2xl font-bold text-[#002D74]">Trẻ em {index + 1}</h2>
                <div className="flex mt-6 flex-row space-x-6">
                    <div style={{flex: 2}}>
                        <label className="font-semibold block text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            name=""
                            id=""
                            placeholder="VD: NGUYEN VAN A"
                            className="w-72 px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label className="font-semibold block text-gray-700">Giới tính</label>
                        <select required
                                className="w-32 px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none">
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                            <option value="Others">Khác</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="font-semibold block text-gray-700">Ngày sinh</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfantCard({index}) {
    return (
        <div className="bg-white border-4 p-10 mx-20 flex rounded-2xl shadow-lg">
            <div className="px-5">
                <h2 className="text-2xl font-bold text-[#002D74]">Trẻ sơ sinh {index + 1}</h2>
                <div className="mt-6 space-y-3 flex flex-col">
                    <div className="flex flex-row space-x-6">
                        <div style={{flex: 2}}>
                            <label className="font-semibold block text-gray-700">Họ và tên</label>
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder="VD: NGUYEN VAN A"
                                className="w-72 px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Giới tính</label>
                            <select required
                                    className="w-32 px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none">
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Others">Khác</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Ngày sinh</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Người giám hộ</label>
                            <input
                                type="text"
                                placeholder="Nhập số định danh của người đi cùng"
                                minLength="8"
                                maxLength="15"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Passengers;