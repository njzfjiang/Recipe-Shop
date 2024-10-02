import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Recipe () {
    let content = null;
    const { id } = useParams();
    const url = `http://localhost/api/recipe/${id}`;
    const [recipeData, setRecipeData] = useState({
        loading:false,
        data:null,
        error:false,
    });

    
    useEffect (() => {
        setRecipeData({
            loading: true,
            data: null,
            error: false,
        })

        axios.get(url)
            .then(response => {
                setRecipeData({
                    loading:false,
                    data: response.data,
                    error:false,
                })
            .catch((error) => {
                console.log(error);
                setRecipeData({
                    loading:false,
                    data: null,
                    error:true,})
            })
        })
    },[url])

    if(recipeData.error){
        content = <p className="p-3">An error occured, pleast try again later.</p>
    }

    if(recipeData.loading){
        content = <p className="p-3">Fetching Recipe...</p>
    }

    //render content if there is data.
    if(recipeData.data){
        let ingredientList = 
        recipeData.data.recipe.ingredientLines.map((ingredient, key) =>
            <div className="mb-3">{ingredient}</div>
        );

        content =
            <div className="container text-center p-3">
                <div className="row">
                    <div className="col">
                        <h2>{recipeData.data.recipe.label}</h2>
                        <p>Recipe from {recipeData.data.recipe.source}</p>
                        <img src={recipeData.data.recipe.image} alt="recipe"/>
                        
                    </div>

                    <div className="col">
                        <h3 className="mb-3">Ingredients</h3>
                        {ingredientList}
                        <h3 className="mb-3">Preparation</h3>
                        <a href={recipeData.data.recipe.url}>Find instructions here</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col p-3">
                        <Link to="/search"><button className="btn btn-outline-success">Search More recipes</button></Link>
                    </div>
                </div>
            </div> 
     }

    return (
        <>
        <Navbar />
        {content}
        </>
    )
}

export default Recipe;
