import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Recipe () {
    //check if user is logged in...
    let button = null;
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);
    
    //variables for rendering dynamic contents
    let content = null;
    const { id } = useParams();
    const url = "http://" + window.location.host + "/api/recipe/"+ id;
    const [recipeData, setRecipeData] = useState({
        loading:false,
        data:null,
        error:false,
    });
    
    //for favorites button
    const [isFavorite, setIsFavorite] = useState(false);
    const favorite_url = "http://" + window.location.host + "/api/favorites/"+ id;
    const isFavorite_url = "http://" + window.location.host + "/api/is-favorite/"+ id;

    const handleAdd =(e)=>{
        e.preventDefault();
        axios.post(favorite_url, {username: currUser})
            .then( res => {
                if(res.status === 201){
                    alert("Recipe Successfully added.");
                }
            })
            .catch((error)=>{
                alert("Recipe already saved.")
                console.error("Error while adding to favorites", error)
            })
    }

    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
          axios.get()
        }
      }, [currUser])
    
    //show the add to favorites button if logged in
    if(loggedIn){
        button = <button className="btn btn-outline-primary" onClick={handleAdd}>Add to Favorites</button>
    }
    //don't show it if not logged in
    if(!loggedIn){
        button = null;
    }

    
    
    useEffect (() => {
        setRecipeData({
            loading: true,
            data: null,
            error: false,
        })

        axios.get(url)
            .then( response =>  {
                setRecipeData({
                    loading:false,
                    data: response.data,
                    error:false,})
                
            })
            .catch((error) => {
            //console.log(error);
            setRecipeData({
                loading:false,
                data: null,
                error:true,})
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
        recipeData.data.recipe.ingredientLines.map((ingredient,i) =>
            <div key={i} className="mb-3">{ingredient}</div>
        );

        content =
            <div className="container text-center p-3">
                <div className="row">
                    <div className="col">
                        <h2>{recipeData.data.recipe.label}</h2>
                        <p data-testid="source">Recipe from {recipeData.data.recipe.source}</p>
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
                        <p></p>
                        {button}
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
