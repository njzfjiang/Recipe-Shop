import React from "react";

const RecipeCard = (props) => {
    return (
        <div className="card p-3 mb-3 w-25">
            <img src={props.recipe.recipe.image} className="card-img-top" alt="cardImg"/>
            <h5 className="card-title">{props.recipe.recipe.label}</h5>
        </div>
    )
}

export default RecipeCard;