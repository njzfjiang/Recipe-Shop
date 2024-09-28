import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import AboutUs from "./pages/AboutUs";


function App() {
    return (
        <>
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />}/>
                <Route path="/search" element={<Search />}/>
                <Route path="/about-us" element={<AboutUs />}/>
                <Route path="*" element={<Navigate to="/" />}/>
            </Routes>
        </Router>
        
        </>
    )
}

export default App;