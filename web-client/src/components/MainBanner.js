import React from "react";
import { Link } from "react-router-dom";

function MainBanner() {
    return (
        <div className="bg-dark text-center">
            <p data-testid="main-banner" className="bg-dark text-white p-3">Find and collect your favourite recipes with Recipe Shop!  <Link to="/register" > register now  </Link></p>
        </div>
    )
}

export default MainBanner;