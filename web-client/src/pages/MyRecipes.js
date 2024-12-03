import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function MyRecipes () {
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);
    let content = null;
    let recipeList = null;
    
    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else if (currUser !== null){
          setLoggedIn(true);
        }
    }, [currUser])

    if(loggedIn === true){
        content = <div className="p-3">
            <input type="text" className="form-control mb-3" placeholder="Keyword"/>
            {recipeList}
        </div>
    }

    if(loggedIn === false){
        content = <p className="text-center p-3">Please Sign in to view your original recipes.</p>
    }
    return (<>
        <Navbar />
        {content}
    </>)
}

export default MyRecipes;