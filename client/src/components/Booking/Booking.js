import {Route, Routes} from "react-router-dom";
import FlightSelection from "./FlightSelection";
import HomePage from "./HomePage";
import Passengers from "./Passengers";

function Booking() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/flight-selection" element={<FlightSelection/>}/>
                <Route path="/passengers" element={<Passengers/>}/>
            </Routes>
        </div>
    );
}

export default Booking;