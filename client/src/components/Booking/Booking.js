import {Route, Routes} from "react-router-dom";
import FlightSelection from "./FlightSelection";
import HomePage from "./HomePage";

function Booking() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/flight-selection" element={<FlightSelection/>}/>
            </Routes>
        </div>
    );
}

export default Booking;