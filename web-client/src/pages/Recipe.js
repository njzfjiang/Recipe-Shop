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
    let recipeTitle = "";
    const [isFavorite, setIsFavorite] = useState(false);
    let params = new URLSearchParams({ username: currUser, title: recipeTitle}).toString();
    const favorite_url = "http://" + window.location.host + "/api/favorites/"+ id +"?"+ params;
    
    
    const handleAdd =(e)=>{
        e.preventDefault();
        let parseIng = [recipeData.data.recipe.ingredients.length];
        //Include any fields that are need to be stored to the db here
        for(let i = 0; i < recipeData.data.recipe.ingredients.length; i++) {
            parseIng[i] = {food:recipeData.data.recipe.ingredients[i].food.replace(',', "\,"),// eslint-disable-line
                            text:recipeData.data.recipe.ingredients[i].text.replace(',', "\,")}// eslint-disable-line
        }
        params = new URLSearchParams({ username: currUser, title: recipeTitle, ingredients: JSON.stringify(parseIng) }).toString();
        const url_with_title = "http://" + window.location.host + "/api/favorites/"+ id +"?"+ params;
        axios.post(url_with_title)
            .then( res => {
                if(res.status === 201){
                    setIsFavorite(true)
                    alert("Recipe Successfully added.");
                }
            })
            .catch((error)=>{
                if(error.status === 409){
                    setIsFavorite(true)
                    alert("Recipe already saved.");
                }
                else{
                    alert("An error occured, please try again later.")
                }
                console.error("Error while adding to favorites", error); 
            })
    }

    const handleDelete =(e)=>{
        e.preventDefault();
        axios.delete(favorite_url)
            .then(res => {
                if(res.status === 204){
                    setIsFavorite(false)
                    alert("Recipe deleted from favorites.")
                }
            })
            .catch((error)=>{
                alert("An error occured, please try again later.")
                console.error("Error while deleting from favorites", error)
            })
    }

    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
        
          let params = new URLSearchParams({ username: currUser }).toString();
          const isFavorite_url = `http://${window.location.host}/api/is-favorite/${id}?${params}`;
          //get if this recipe has been saved in favorites.
            axios.get(isFavorite_url)
            .then(res => {
                if(res.status === 200 || res.status === 304){
                    setIsFavorite(res.data.saved)
                }
            })
            .catch(error => {
                console.error("Error when getting favorites", error)
           })
        }
      }, [currUser, id])
    

    //show the add to favorites button if logged in
    if(loggedIn){
        button = <>
        {isFavorite ? 
            <button data-testid="remove_favorite" className="btn btn-outline-danger" onClick={handleDelete}>Remove from Favorites</button>:
            <button data-testid="add_favorite" className="btn btn-outline-primary" onClick={handleAdd}>Add to Favorites</button> 
             }
        <p></p>
        <Link to={`/favorites/${currUser}`}><button data-testid="search_more" className="btn btn-outline-primary">View Favorites</button></Link>
        </>
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
            //
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
        //get title from data.
        recipeTitle = recipeData.data.recipe.label;

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
