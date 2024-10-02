import React from "react";
import { Link } from "react-router-dom";

const RecipeCard = (props) => {
    let recipeURI = props.recipe.recipe.uri;
    let recipeID = recipeURI.substring(recipeURI.indexOf("_")+1)
    return (
        
        <div className="card p-3 mb-3 w-25">
            <Link to={`/recipes/${recipeID}`}><img src={props.recipe.recipe.image} className="card-img-top" alt="cardImg"/></Link>
            <h5 className="card-title">{props.recipe.recipe.label}</h5>
        </div>
        
    )
}

export default RecipeCard;