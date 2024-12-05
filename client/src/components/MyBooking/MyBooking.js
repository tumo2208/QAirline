import {Route, Routes} from "react-router-dom";
import HomePage from "../MyBooking/HomePage";
import ManageBooking from "./ManageBooking";
import BookingHistory from "./BookingHistory";

function MyBooking(){
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/manage-booking" element={<ManageBooking/>}/>
                <Route path="/booking-history" element={<BookingHistory/>}/>
            </Routes>
        </div>
    );
}

export default MyBooking;