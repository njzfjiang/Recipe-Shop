import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function UploadedRecipe() {
    //check if user is logged in...
    let content = null;
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

    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
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


    
  if(recipeData.error){
      content = <p className="p-3">An error occured, pleast try again later.</p>
  }

  if(recipeData.loading){
      content = <p className="p-3">Fetching Recipe...</p>
  }

  if(recipeData.data){
    let ingredientList = 
    recipeData.data.find_recipe.ingredients.map((ingredient,i) =>
        <div key={i} className="mb-3">{ingredient}</div>
    );

    let appendImage = "data:image/jpeg;base64,"+recipeData.data.find_recipe.image
    
      content =  <div className="container text-center p-3">
      <div className="row">
          <div className="col">
              <h2>{recipeData.data.find_recipe.title}</h2>
              <p data-testid="source">Recipe from {recipeData.data.find_recipe.source}</p>
              <img src={appendImage} style={{width:250, height:250}} alt="recipe"/>
              
          </div>

          <div className="col">
              <h3 className="mb-3">Ingredients</h3>
              {ingredientList}
              <h3 className="mb-3">Preparation</h3>
              <p>{recipeData.data.find_recipe.instructions}</p>
          </div>
      </div>
      <div className="row">
          <div className="col p-3">
              <Link to="/search"><button className="btn btn-outline-success">Search More recipes</button></Link>
              <p></p>
              <button className="btn btn-outline-danger" onClick={handleDelete}>Delete this Recipe</button>
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