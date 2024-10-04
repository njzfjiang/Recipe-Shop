import React from "react";
import { Link } from "react-router-dom";
import { getIDfromURI } from "../utils/getIDfromURI";

const RecipeCard = (props) => {
    let recipeID = getIDfromURI(props.recipe.recipe.uri)
    return (    
        <div className="card p-3 mb-3 w-25">
            <Link to={`/recipes/${recipeID}`}><img src={props.recipe.recipe.image} className="card-img-top" alt="cardImg"/></Link>
            <h5 className="card-title">{props.recipe.recipe.label}</h5>
        </div>
        
    )
}

export default RecipeCard;