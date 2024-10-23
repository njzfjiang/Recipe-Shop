import React, { useEffect, useState } from "react";
import recipes from '../images/Recipes.jpg';
import { Link } from "react-router-dom";

function FavoriteRecipes() {
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);
    let button = null;

    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
        }
      }, [currUser])
    
    if(loggedIn){
      let link = "/favorites/"+ currUser;
        button = <Link to={link}><button className="btn btn-outline-primary">Manage</button></Link>
    }
    
    if(!loggedIn){
        button = <Link to="/login"><button className="btn btn-outline-primary">Sign in</button></Link>
    }


    return (
        <div className="card p-3">
            <img src={recipes} className="card-img-top" alt="cardImg" height={300}/>
            <div className="card-body">
            <h5 className="card-title">Favourite recipes</h5>
            <p className="card-text">Manage and view your favourite recipes.</p>
            {button}
            </div>
        </div>
    )
}

export default FavoriteRecipes;