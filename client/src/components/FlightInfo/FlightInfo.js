import {Route, Routes} from "react-router-dom";
import HomePage from "./HomePage";

function FlightInfo() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage/>} />
            </Routes>
        </div>
    );
}

export default FlightInfo;