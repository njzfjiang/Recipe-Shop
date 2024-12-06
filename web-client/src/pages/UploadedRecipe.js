import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function UploadedRecipe() {
    //check if user is logged in...
    let content = null;
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);

    const { id } = useParams();
    const url = "http://" + window.location.host + "/api/recipe/upload/"+ id;
    const [recipeData, setRecipeData] = useState({
        loading:false,
        data:null,
        error:false,
    });

    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else {
          setLoggedIn(true);

        }
    }, [currUser, id, url])

    return(<>
    <Navbar />
    {content}
    </>)
}

export default UploadedRecipe;