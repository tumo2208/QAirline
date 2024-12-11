import React, {useEffect} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../logo.svg";

function BookingSuccessful() {
    const location = useLocation();
    const { state } = location;
    const { bookingID } = state;
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

    return (
        <div className="bg-white mx-auto px-10 mb-32 max-w-5xl flex flex-col items-center justify-center space-y-10">
            <div>
                <img
                    src={logo}
                    className="h-48 w-48"
                    alt="QAriline Logo"
                />
            </div>
            <div className="flex flex-col space-y-4 pb-4">
                <h2 className="lg:text-5xl md:text-4xl text-3xl font-bold text-center text-[#002D74]">Chúc mừng, bạn đã đặt chỗ thành công !</h2>
                <p className="text-2xl md:text-3xl lg:text-3xl font-bold text-center">Mã đặt chỗ của bạn là: <span className="text-yellow-600">{bookingID}</span></p>
            </div>
            <div className="lg:text-lg md:text-lg text-md text-center">
                <i>Nếu bạn muốn xem lại thông tin của các vé đã đặt hoặc hủy vé, hãy tra cứu mã đặt chỗ này ở <Link to="/" className="font-semibold underline text-blue-500 hover:text-blue-700 focus:text-blue-700">Trang chủ</Link> ➡️ Quản lý đặt chỗ
                 <strong> HOẶC</strong> <Link to="/mybooking" className="font-semibold underline text-blue-500 hover:text-blue-700 focus:text-blue-700">Vé của tôi</Link> ➡️ Tra cứu mã đặt chỗ</i>
            </div>
            <div className="text-left mx-8">
                <button
                    type="button"
                    className="text-white select-none bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg lg:hover:scale-110 px-5 py-2.5 text-center"
                    onClick={() => navigate("/")}
                >
                    <span className="mr-2 font-bold text-lg">←</span>
                    Quay về trang chủ
                </button>
            </div>
        </div>
    );
}

export default BookingSuccessful;