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
import Recipe from "./pages/Recipe";
import Favorites from "./pages/Favorites";
import Upload from "./pages/Upload";
import MyRecipes from "./pages/MyRecipes";
import UploadedRecipe from "./pages/UploadedRecipe";
import React from "react";


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
                <Route path="/recipes/:id" element={<Recipe />}/>
                <Route path="/favorites/:username" element={<Favorites />}/>
                <Route path="/upload" element={<Upload />}/>
                <Route path="/my-recipes" element={<MyRecipes />}/>
                <Route path="/uploaded-recipes/:id" element={<UploadedRecipe />}/>
                <Route path="*" element={<Navigate to="/" />}/>
            </Routes>
        </Router>
        
        </>
    )
}

export default App;