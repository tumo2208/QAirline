import BookingInfo from "./BookingInfo";
import React, { useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {nationalities} from "../../shared/SharedData";
import axios from "axios";

function Passengers() {
    const { state } = useLocation();
    const { outboundFlight, returnFlight , tripType, passengers } = state;
    const navigate = useNavigate();

    const outboundFlightID = outboundFlight.flight.flight_number;
    const returnFlightID = returnFlight ? returnFlight.flight.flight_number : null;

    const [formData, setFormData] = useState({
        adults: Array.from({ length: passengers.adults }, () => ({
            customer_name: "",
            dob: "",
            gender: "Male",
            nationality: nationalities[0],
            phone_number: "",
            email: "",
            id_type: "Citizen ID",
            id_number: "",
            country_issuing: nationalities[0],
            date_expiration: "",
        })),
        children: Array.from({ length: passengers.children }, () => ({
            customer_name: "",
            dob: "",
            gender: "Male",
        })),
        infants: Array.from({ length: passengers.infants }, () => ({
            customer_name: "",
            dob: "",
            gender: "Male",
            fly_with: "",
        })),
    });

    const handleInputChange = (e, category, index, field) => {
        const updatedData = { ...formData };
        updatedData[category][index][field] = e.target.value;
        setFormData(updatedData);
    };

    const handleNext = async () => {
        const isValid = validateForm();
        if (!isValid) {
            alert("Please fill out all required fields.");
            return;
        }

        try {
            const BookingData = {
                outboundFlightID: outboundFlightID,
                returnFlightID: returnFlightID,

                numAdult: passengers.adults,
                numChildren: passengers.children,
                numInfant: passengers.infants,
                classType: outboundFlight.classType,
                returnClassType: returnFlight ? returnFlight.classType : null,

                adultList: formData.adults,
                childrenList: formData.children,
                infantList: formData.infants
            };

            console.log("Booking Data:", JSON.stringify(BookingData, null, 2));
            const response = await axios.post(
                "http://localhost:3001/api/bookings/newBooking", 
                BookingData,
                {
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                const result = await response.data;
                console.log("Booking successful", result);
                navigate("/booking/booking-successfully", { state: { bookingID: result.bookingID }});
            } else {
                alert("Booking failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Error details:", error.response ? error.response.data : error.message);
            alert(`Booking indeed failed: ${error.message}`);
        }
    };

    const validateForm = () => {
        return (
            validatePassengers(formData.adults) &&
            validatePassengers(formData.children) &&
            validatePassengers(formData.infants)
        );
    };

    const validatePassengers = (passengersArray) => {
        return passengersArray.every((passenger) => {
            return Object.values(passenger).every((value) => value !== "" && value !== undefined);
        });
    };

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
                            <AdultCard 
                                key={`adult-${index}`}
                                index={index}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        ))}
                        {Array.from({length: passengers.children}).map((_, index) => (
                            <ChildrenCard
                                key={`child-${index}`}
                                index={index}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        ))}
                        {Array.from({length: passengers.infants}).map((_, index) => (
                            <InfantCard 
                                key={`infant-${index}`}
                                index={index}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        ))}
                    </div>
                </div>
                <div style={{flex: 3}}>
                    <BookingInfo 
                        outboundFlight={outboundFlight} 
                        returnFlight={returnFlight} 
                        tripType={tripType}
                        passengers={passengers}
                    />
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

function AdultCard({ index, formData, handleInputChange }) {
    const passenger = formData.adults[index];
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
                                value={passenger.customer_name}
                                onChange={(e) => handleInputChange(e, "adults", index, "customer_name")}
                                placeholder="VD: NGUYEN VAN A"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Giới tính</label>
                            <select required
                                    value={passenger.gender}
                                    onChange={(e) => handleInputChange(e, "adults", index, "gender")}
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
                                value={passenger.dob}
                                onChange={(e) => handleInputChange(e, "adults", index, "dob")}
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Quốc tịch</label>
                            <select
                                value={passenger.nationality}
                                onChange={(e) => handleInputChange(e, "adults", index, "nationality")}
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
                                value={passenger.phone_number}
                                onChange={(e) => handleInputChange(e, "adults", index, "phone_number")}
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
                                value={passenger.email}
                                onChange={(e) => handleInputChange(e, "adults", index, "email")}
                                placeholder="VD: example@abc.com"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Loại giấy tờ tùy thân</label>
                            <select 
                                required
                                value={passenger.id_type}
                                onChange={(e) => handleInputChange(e, "adults", index, "id_type")}
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none">
                                <option value="Citizen ID">Căn cước công dân</option>
                                <option value="Passport">Hộ chiếu</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Số định danh</label>
                            <input
                                type="text"
                                placeholder="Nhập theo giấy tờ tùy thân"
                                value={passenger.id_number}
                                onChange={(e) => handleInputChange(e, "adults", index, "id_number")}
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
                                value={passenger.country_issuing}
                                onChange={(e) => handleInputChange(e, "adults", index, "country_issuing")}
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
                                value={passenger.date_expiration}
                                onChange={(e) => handleInputChange(e, "adults", index, "date_expiration")}
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

function ChildrenCard({index, formData, handleInputChange}) {
    const children = formData.children[index];
    return (
        <div className="bg-white border-4 p-10 mx-20 flex rounded-2xl shadow-lg">
            <div className="px-5">
                <h2 className="text-2xl font-bold text-[#002D74]">Trẻ em {index + 1}</h2>
                <div className="flex mt-6 flex-row space-x-6">
                    <div style={{flex: 2}}>
                        <label className="font-semibold block text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            value={children.customer_name}
                            onChange={(e) => handleInputChange(e, "children", index, "customer_name")}
                            placeholder="VD: NGUYEN VAN A"
                            className="w-72 px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label className="font-semibold block text-gray-700">Giới tính</label>
                        <select 
                            required
                            value={children.gender}
                            onChange={(e) => handleInputChange(e, "children", index, "gender")}
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
                            value={children.dob}
                            onChange={(e) => handleInputChange(e, "children", index, "dob")}
                            className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfantCard({index, formData, handleInputChange}) {
    const infant = formData.infants[index];
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
                                value={infant.customer_name}
                                onChange={(e) => handleInputChange(e, "infants", index, "customer_name")}
                                id=""
                                placeholder="VD: NGUYEN VAN A"
                                className="w-72 px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="font-semibold block text-gray-700">Giới tính</label>
                            <select 
                                value={infant.gender}
                                onChange={(e) => handleInputChange(e, "infants", index, "gender")}
                                required
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
                                value={infant.dob}
                                onChange={(e) => handleInputChange(e, "infants", index, "dob")}
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
                                value={infant.fly_with}
                                onChange={(e) => handleInputChange(e, "infants", index, "fly_with")}
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