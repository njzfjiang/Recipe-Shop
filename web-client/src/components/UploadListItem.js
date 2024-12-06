import React from "react";
import { Link } from "react-router-dom";

const UploadListItem = (props) => {
    let recipeID = props.recipeID;
    let content = props.title;

    return (
        <div className="p-3 mb-3 list-group-item list-group-item-action list-group-item-light">
            <Link to={`/uploaded-recipes/${recipeID}`}>{content}</Link>
        </div>
    );
}

export default UploadListItem;