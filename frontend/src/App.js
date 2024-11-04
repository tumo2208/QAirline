import './App.css';
import Home from "./pages/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Booking from "./pages/Booking";
import Travelinfo from "./pages/Travelinfo";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
