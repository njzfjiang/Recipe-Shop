import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo-transparent-png.png";
import { getIDfromURI } from "../utils/getIDfromURI";

const RecipeCardLocal = (props) => {
    let recipeID = getIDfromURI(props.recipe.find_recipe._id)
    let image =  props.recipe.find_recipe.image;
    if(image !== ""){
        image = "data:image/png;base64," + image;
    }
    else{
        image = logo;
    }
    return (    //link doesn't work yet
        <div className="card p-3 mb-3 w-25">
            <Link to={`/uploaded-recipes/${recipeID}`}><img src={image} className="card-img-top" alt="cardImg"/></Link>
            <h5 className="card-title">{props.recipe.find_recipe.title}</h5>
        </div>
        
    )
}

export default RecipeCardLocal;