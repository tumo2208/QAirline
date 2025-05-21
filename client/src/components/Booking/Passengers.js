import BookingInfo from "./BookingInfo";
import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {nationalities} from "../../shared/SharedData";
import Loading from '../../shared/Loading';
import axios from "axios";

function Passengers() {
    const location = useLocation();
    const { state } = location;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const { outboundFlight, returnFlight , tripType, passengers } = state;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const outboundFlightID = outboundFlight.flight.flight_number;
    const returnFlightID = returnFlight?.flight?.flight_number || null;

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
            setError("Xin hãy điền đầy đủ thông tin !");
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        if (window.confirm("Hãy chắc chắn rằng bạn đã điền chính xác các thông tin, nếu chọn OK bạn sẽ không thể thay đổi các thông tin đã nhập !")) {
            setLoading(true);
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

                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/bookings/newBooking`, 
                    BookingData,
                    {
                        withCredentials: true
                    }
                );

                if (response.status === 200) {
                    const result = await response.data;
                    for (let i = 0; i < BookingData.adultList.length; i++) {
                        const person = BookingData.adultList[i];
                        if (person && person.email) {
                            const emailData = {
                                email: person.email,
                                subject: "QAriline - Xác nhận đặt chỗ",
                                content:`
                                    <div style="font-family: Arial, sans-serif; color: #333;">
                                        <h1 style="color: #0066cc;">Chúc mừng bạn!</h1>
                                        <p style="font-size: 16px;">
                                            Bạn đã đặt chỗ thành công với mã đặt chỗ: 
                                            <strong style="color: #ff6600;">${result.bookingID}</strong>.
                                        </p>
                                        <p style="font-size: 14px;">
                                            Vui lòng giữ mã đặt chỗ này để tra cứu thông tin hoặc hủy vé nếu cần.
                                        </p>
                                        <div style="margin-top: 20px; padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;">
                                            <p>
                                                Để xem chi tiết, vui lòng truy cập: 
                                                <a href="http://localhost:3000/mybooking" style="color: #0066cc; text-decoration: none;">
                                                    Tra cứu vé đặt chỗ
                                                </a>
                                            </p>
                                        </div>
                                        <p style="margin-top: 20px;">
                                            Cảm ơn bạn đã sử dụng dịch vụ của <strong>QAriline</strong>!
                                        </p>
                                        <footer style="font-size: 12px; color: #777; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
                                            Đây là email tự động, vui lòng không trả lời trực tiếp. Nếu bạn cần hỗ trợ, vui lòng liên hệ <a href="mailto:support@qariline.com" style="color: #0066cc;">support@qariline.com</a>.
                                        </footer>
                                    </div>
                                `
                            };
                            await axios.post(`${process.env.REACT_APP_API_URL}/email/send`, emailData, { withCredentials: true });
                        }
                    }
                    navigate("/booking/booking-successfully", { state: { bookingID: result.bookingID }});
                } else {
                    setError("Booking thất bại " + response.data.message);
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                }
            } catch (error) {
                console.error("Lỗi cụ thể:", error.response ? error.response.data : error.message);
                setError(`Booking đã thất bại: ${error.message}`);
                setTimeout(() => {
                    setError('');
                }, 2000);
            }

            setLoading(false);
        }
    };

    const validateForm = () => {
        return (
            validatePassengers(formData.adults) &&
            validatePassengers(formData.children) &&
            validatePassengers(formData.infants) && validateEmail()
        );
    };

    const validateEmail = () => {
        for (let i = 0; i < formData.adults.length; i++) {
            if (!isValidEmail(formData.adults[i].email)) {
                setError(`Email không hợp lệ`);
                setTimeout(() => {
                    setError('');
                }, 2000);
                return false;
            }
        }
        return true;
    };

    const isValidEmail = (email) => {
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return emailRegex.test(email);
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
            <div className="bg-gray-100 flex flex-col lg:flex-row ">
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lilita+One&family=Pangolin&family=Potta+One&family=Protest+Revolution&display=swap"
                    rel="stylesheet"/>
                <div style={{flex: 7}}>
                    {error && <div className="bg-red-200 p-3 text-red-700 text-center">{error}</div>}
                    <div className="bg-sky-200 my-5 mx-20 p-6 rounded-lg shadow-lg mb-6">
                        <div className="items-center text-center text-3xl font-semibold"
                             style={{fontFamily: "Barlow Condensed"}}>
                            Thông tin khách hàng
                        </div>
                    </div>
                    <div className="flex w-full flex-col space-y-5 my-5">
                        {Array.from({length: passengers.adults}).map((_, index) => (
                            <AdultCard 
                                key={`adult-${index}`}
                                index={index}
                                formData={formData}
                                flightType={outboundFlight.flight.is_international}
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
            {loading && <Loading/>}
        </div>

    )
}

function AdultCard({ index, formData, flightType, handleInputChange }) {
    const passenger = formData.adults[index];
    return (
        <div className="bg-white border-4 w-full p-10 mx-auto max-w-4xl flex rounded-2xl shadow-lg">
            <div className="px-5 w-full">
                <h2 className="text-2xl font-bold text-[#002D74]">Người lớn {index + 1}</h2>
                <div className="mt-6 space-y-3 flex flex-col">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-5">
                    <div style={{flex: 2}}>
                            <label className="font-semibold block text-gray-700">Họ và tên</label>
                            <input
                                type="text"
                                value={passenger.customer_name}
                                onChange={(e) => handleInputChange(e, "adults", index, "customer_name")}
                                placeholder="VD: Nguyen Van A"
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

                        <div style={{flex:1}}>
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
                        <div style={{flex:2}}>
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
                        <div style={{flex:2}}>
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
                                onChange={(e) => handleInputChange(e, "adults", index, "id_type")}
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            >
                                {!flightType && <option value="Citizen ID">Căn cước công dân</option>}
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
        <div className="bg-white border-4 w-full p-10 mx-auto max-w-4xl flex rounded-2xl shadow-lg">
            <div className="w-full px-5">
                <h2 className="text-2xl font-bold text-[#002D74]">Trẻ em {index + 1}</h2>
                <div className="flex items-center justify-center mt-6 flex-col md:flex-row lg:flex-row
                        lg:space-x-4 md:space-x-4 lg:space-y-0 md:space-y-0 space-y-4">
                    <div className="w-full flex-1">
                        <label className="font-semibold inline-block text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            value={children.customer_name}
                            onChange={(e) => handleInputChange(e, "children", index, "customer_name")}
                            placeholder="VD: Nguyen Van A"
                            className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            required
                        />
                    </div>

                    <div className="w-full flex-1">
                        <label className="font-semibold inline-block text-gray-700">Giới tính</label>
                        <select 
                            required
                            value={children.gender}
                            onChange={(e) => handleInputChange(e, "children", index, "gender")}
                            className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none">
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                            <option value="Others">Khác</option>
                        </select>
                    </div>

                    <div className="w-full flex-1">
                        <label className="font-semibold inline-block text-gray-700">Ngày sinh</label>
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
        <div className="bg-white border-4 w-full p-10 mx-auto max-w-4xl flex rounded-2xl shadow-lg">
            <div className="w-full px-5">
                <h2 className="text-2xl font-bold text-[#002D74]">Trẻ sơ sinh {index + 1}</h2>
                <div className="mt-6 w-full space-y-3 flex flex-col">
                    <div className="flex items-center justify-center mt-6 flex-col md:flex-row lg:flex-row
                        lg:space-x-4 md:space-x-4 lg:space-y-0 md:space-y-0 space-y-4">
                        <div className="w-full flex-1">
                            <label className="font-semibold block text-gray-700">Họ và tên</label>
                            <input
                                type="text"
                                value={infant.customer_name}
                                onChange={(e) => handleInputChange(e, "infants", index, "customer_name")}
                                id=""
                                placeholder="VD: NGUYEN VAN A"
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1 w-full">
                            <label className="font-semibold block text-gray-700">Giới tính</label>
                            <select 
                                value={infant.gender}
                                onChange={(e) => handleInputChange(e, "infants", index, "gender")}
                                required
                                className="w-full px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none">
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Others">Khác</option>
                            </select>
                        </div>

                        <div className="flex-1 w-full">
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
                            <label className="font-semibold block text-gray-700">Người đi cùng</label>
                            <input
                                type="text"
                                placeholder="Nhập số định danh của người đi cùng"
                                value={infant.fly_with}
                                onChange={(e) => handleInputChange(e, "infants", index, "fly_with")}
                                minLength="8"
                                maxLength="15"
                                className="w-full lg:w-1/2 md:w-1/2 px-3 py-2 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
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