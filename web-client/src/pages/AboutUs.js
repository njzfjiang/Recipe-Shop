import React from "react";
import Navbar from "../components/Navbar";
import Logo from "../images/logo-png.png";
import mission from "../images/mission.png";

function AboutUs () {
    return(
        <>
        <Navbar />
        <div className="container text-center">
            <div className="row">
                <div className="col py-5">
                    <img src={Logo} alt="brand-logo" className="w-50"></img>
                    <h1>About Us</h1>
                    <p>Recipe Shop is an online platform built for anyone who loves to cook or needs a hand in preparing meals. Recipe shop aims to provide convenience in the process of preparing meals and grocery shopping; and allows people of similar interests to find and share their favorite recipes.</p>
                </div>
                <div className="col">
                    <img src={mission} alt="mission"></img>
                </div>
            </div>
        </div>
        </>
    )
}

export default AboutUs;