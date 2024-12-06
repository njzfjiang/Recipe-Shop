import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo-transparent-png.png";

function UploadedRecipe() {
    //check if user is logged in...
    let content = null;
    let button = null;
    let deleteButton = null;
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);

    const { id } = useParams();
    const url = "http://" + window.location.host + "/api/recipe/upload/"+ id;
    const [recipeData, setRecipeData] = useState({
        loading:true,
        data:null,
        error:false,
    });
    const navigate = useNavigate()


    const handleDelete =(e)=>{
      let params = new URLSearchParams({ username: currUser }).toString();
      let delete_url = "http://" + window.location.host + "/api/uploads/"+ id + "?"+ params;
      e.preventDefault();
      axios.delete(delete_url)
          .then(res => {
              if(res.status === 204){
                  alert("Recipe deleted.")
                  //navigate to my recipes.
                  setTimeout(() => {
                    navigate('/my-recipes');
                    }, 2000);
              }
          })
          .catch((error)=>{
              alert("An error occured, please try again later.")
              console.error("Error while deleting from uploaded", error)
          })
    }

    //for favorites button
    let recipeTitle = "";
    const [isFavorite, setIsFavorite] = useState(false);
    let params = new URLSearchParams({ username: currUser, title: recipeTitle }).toString();

    //for delete button
    const [isUpload, setIsUpload] = useState(false);

    const handleAddFav =(e)=>{
      e.preventDefault();
      params = new URLSearchParams({ username: currUser, title: recipeTitle, source: "recipe-shop" }).toString();
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

  const handleDeleteFav =(e)=>{
      e.preventDefault();
      params = new URLSearchParams({ username: currUser, title: recipeTitle, source: "recipe-shop" }).toString();
      const favorite_url = "http://" + window.location.host + "/api/favorites/"+ id +"?"+ params;
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
          params = new URLSearchParams({ username: currUser, title: recipeTitle, source: "recipe-shop" }).toString();
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

            const isUploadParams = new URLSearchParams({ username: currUser }).toString();
            const isUpload_url = `http://${window.location.host}/api/is-upload/${id}?${isUploadParams}`;
            //get if this recipe has been saved in favorites.
            axios.get(isUpload_url)
            .then(res => {
                if(res.status === 200 || res.status === 304){
                    setIsUpload(res.data.uploaded)
                }
            })
            .catch(error => {
                console.error("Error when getting uploads", error)
           })

          axios.get(url)
          .then(result => {console.log(result)
            if(result.status === 200){
              setRecipeData({
                loading:false,
                data:result.data,
                error:false
              })
            }
          })
          .catch(error => {console.log(error);
            setRecipeData({
                loading:false,
                data:null,
                error:true
            })
          });
        }
    }, [currUser, url])

    //show the add to favorites button if logged in
    if(loggedIn){
      button = <>
      {isFavorite ? 
          <button data-testid="remove_favorite" className="btn btn-outline-danger" onClick={handleDeleteFav}>Remove from Favorites</button>:
          <button data-testid="add_favorite" className="btn btn-outline-primary" onClick={handleAddFav}>Add to Favorites</button> 
           }
      <p></p>
      <Link to={`/favorites/${currUser}`}><button data-testid="search_more" className="btn btn-outline-primary">View Favorites</button></Link>
      </>
      console.log(isUpload);
      if(isUpload){
        deleteButton = <button className="btn btn-outline-danger" onClick={handleDelete}>Delete this Recipe</button>
      }
      else{
        deleteButton = null;
      }
    }
    //don't show it if not logged in
    if(!loggedIn){
        button = null;
        deleteButton = null;
    }


    
  if(recipeData.error){
      content = <p className="p-3">An error occured, pleast try again later.</p>
  }

  if(recipeData.loading){
      content = <p className="p-3">Fetching Recipe...</p>
  }

  if(recipeData.data){
    recipeTitle = recipeData.data.find_recipe.title;
    let ingredientList = 
    recipeData.data.find_recipe.ingredients.map((ingredient,i) =>
        <div key={i} className="mb-3">{ingredient}</div>
    );

    let appendImage = recipeData.data.find_recipe.image
    if(appendImage === ""){
        appendImage = logo;
    }
    else{
        appendImage = "data:image/png;base64,"+appendImage;
    }
    let instructions = recipeData.data.find_recipe.instructions;
    
      content =  <div className="container text-center p-3">
      <div className="row">
          <div className="col">
              <h2>{recipeData.data.find_recipe.title}</h2>
              <p data-testid="source">Recipe from {recipeData.data.find_recipe.source}</p>
              <p data-testid="uploader">Uploaded by {recipeData.data.find_recipe.username}</p>
              <img src={appendImage} style={{width:250, height:250}} alt="recipe"/>
              
          </div>

          <div className="col">
              <h3 className="mb-3">Ingredients</h3>
              {ingredientList}
              <h3 className="mb-3">Preparation</h3>
              <p style={{whiteSpace: "pre-wrap"}}>{instructions}</p>
          </div>
      </div>
      <div className="row">
          <div className="col p-3">
              <Link to="/search"><button className="btn btn-outline-success">Search More recipes</button></Link>
              <p></p>
              {button}
              <p></p>
              {deleteButton}
              </div>
      </div>
    </div> 
  }

    return(<>
    <Navbar />
    {content}
    </>)
}

export default UploadedRecipe;