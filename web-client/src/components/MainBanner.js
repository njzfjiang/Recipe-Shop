import React from "react";
import friedRiceImg from "../images/Fried-Rice.jpg";
import bannerImg from "../images/bannerImg.jpg";
import cakeImg from "../images/cake.jpg";

function MainBanner() {
    return (
        <div class="bg-dark text-center">
            <p class="bg-dark text-white p-3"></p>
            <img src={friedRiceImg} alt="bannerImg1" class="p-3" height="300" width="490"/>
            <img src={bannerImg}  alt="bannerImg2" class="p-3" height="300"  width="490"/>
            <img src={cakeImg} alt="bannerImg3" class="p-3" height="300"  width="490"/>
            <p class="bg-dark text-white p-3">Find your favourite recipe with Recipe Shop!  <a class="link-opacity-75" href="/recipes">   learn more  </a></p>
            
        </div>
    )
}

export default MainBanner;