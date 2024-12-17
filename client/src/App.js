import Home from "./components/Home/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Booking from "./components/Booking/Booking";
import FlightInfo from "./components/FlightInfo/FlightInfo";
import MyBooking from "./components/MyBooking/MyBooking";
import Login from "./components/Account/Login";
import Signup from "./components/Account/Signup";
import Profile from "./components/Account/Profile";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import ChangePassword from "./components/Account/ChangePassword";
import ForgotPassword from "./components/Account/ForgotPassword";
import Admin from "./components/Admin/Admin";
import AddFlight from "./components/Admin/AddFlight";
import SetDelayTime from "./components/Admin/SetDelayTime";
import AddAircraft from "./components/Admin/AddAircraft";
import CreatePost from "./components/Admin/CreatePost";
import Destination from "./components/Explore/Destination";
import Offer from "./components/Explore/Offer";
import PostDetail from "./components/Explore/PostDetail";
import ViewStatistic from "./components/Admin/ViewStatistic";

function App() {
    return (
        <Router>
            <div className="App">
                <AppHeader/>

                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/destination" element={<Destination/>}/>
                    <Route path="/destination/:id" element={<PostDetail/>}/>
                    <Route path="/offer" element={<Offer/>}/>
                    <Route path="/offer/:id" element={<PostDetail/>}/>
                    <Route path="/banner/:id" element={<PostDetail/>}/>
                    <Route path="/booking/*" element={<Booking/>}/>
                    <Route path="/flight-info/*" element={<FlightInfo />} />
                    <Route path="/mybooking/*" element={<MyBooking/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword/>} />
                    <Route path="/forgot-password" element={<ForgotPassword/>} />
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/admin/addFlight" element={<AddFlight/>}/>
                    <Route path="/admin/setDelayTime" element={<SetDelayTime/>}/>
                    <Route path="/admin/addAircraft" element={<AddAircraft/>}/>
                    <Route path="/admin/createPost" element={<CreatePost/>}/>
                    <Route path="/admin/viewStatistic" element={<ViewStatistic/>}/>
                </Routes>

                <AppFooter/>
            </div>
        </Router>
    );
}

export default App;
