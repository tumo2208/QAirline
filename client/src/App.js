import Home from "./components/Home/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Explore from "./components/Explore";
import Booking from "./components/Booking";
import Travelinfo from "./components/Travelinfo";
import Help from "./components/Help";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";


function App() {
    return (
        <Router>
            <div className="App">
                <AppHeader/>

                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/explore" element={<Explore/>}/>
                    <Route path="/booking" element={<Booking/>}/>
                    <Route path="/travel-info" element={<Travelinfo />} />
                    <Route path="/help" element={<Help/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                </Routes>

                <AppFooter/>
            </div>
        </Router>
    );
}

export default App;
