import React from "react";
import { Link } from "react-router-dom";

const FavoriteListItem = (props) => {
    let recipeID = props.recipeID;
    let content = props.title;
    let source = props.source;
    let html = ""
    
    if(source === "recipe-shop"){
        html = 
        <div className="p-3 mb-3 list-group-item list-group-item-action list-group-item-light">
            <Link to={`/uploaded-recipes/${recipeID}`}>{content}</Link>
        </div>
    }
    else{
        html = 
        <div className="p-3 mb-3 list-group-item list-group-item-action list-group-item-light">
            <Link to={`/recipes/${recipeID}`}>{content}</Link>
        </div>
    }

    return html;
}

export default FavoriteListItem;