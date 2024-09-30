import React from "react";

const RecipeCard = ({title, imgSrc, recipeLink}) => {
    return (
        <div className="card p-3 w-25">
            <img src={imgSrc} className="card-img-top" alt="cardImg" height={300}/>
            <h5 className="card-title">{title}</h5>
        </div>
    )
}

export default RecipeCard;