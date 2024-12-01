import {Route, Routes} from "react-router-dom";
import HomePage from "../MyBooking/HomePage";
import SearchBooking from "./SearchBooking";
import BookingHistory from "./BookingHistory";

function MyBooking(){
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/search-booking" element={<SearchBooking/>}/>
                <Route path="/booking-history" element={<BookingHistory/>}/>
            </Routes>
        </div>
    );
}

export default MyBooking;