import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FavoriteListItem from "../components/FavoriteListItem";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "axios";

function Favorites () {
    //check if user is logged in
    let search_form = null;
    const { username } = useParams();
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);
    const [filterRecipes, setFilterRecipes] = useState([]);
    
    //search data
    let content= null;
    const [searchData, setSearchData] = useState('');

    const [recipeData, setRecipeData] = useState({
        loading:false,
        data:null,
        error: false,
        default: false
    })

    
    const handleChange = (e) => {
        const searchItem = e.target.value;
        setSearchData(searchItem);

        //if there is data, do the filtering.
        if(recipeData.data !== null){
            applySearch(searchItem);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(searchData !== '' && recipeData.data !== null){
            applySearch(searchData);
        } else {
            alert("Please add a keyword to search.");
        }
    }

    function applySearch(searchPar) {
        let searchField = searchPar.toLowerCase().trim();
        //Regex expression to find substrings in a bracket ()
        let searchIng = searchField.match(/\((.*?)\)/);

        let filteredRecipes = recipeData.data.recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchField));
        if(searchIng) {
            filteredRecipes = recipeData.data.recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchField.replace(searchIng[0], "").trim()));
            let searchIngArr = searchIng[1].split(",");
            for (let i = 0; i < searchIngArr.length; i++) {
                filteredRecipes = filteredRecipes.filter((recipe) => JSON.stringify(recipe.ingredients).toLowerCase().includes(searchIngArr[i]))
            }
        }
        setFilterRecipes(filteredRecipes);
    }

    const handleDeleteAll = (e) => {
        e.preventDefault();
        const url = "http://" + window.location.host + "/api/all-favorites/"+ localStorage.getItem("user");
        axios.delete(url).then((res) => {
            if(res.status === 200){
                setRecipeData({
                    loading:false,
                    data:null,
                    error:false,
                    default:true
                })
            }
        })
        .catch((error) => {
            console.error("Error deleting all recipes.", error);
            setRecipeData({
                loading:false,
                data:recipeData.data,
                error:true,
                default:false
            })
            alert("An error occured, please try again later.")
        })
    }

    const handleGenerateList = (e) => {
        e.preventDefault();
        const urlGenList = "http://" + window.location.host + "/api/generate-list/" + localStorage.getItem("user");
        if(currUser === username) {
            axios.get(urlGenList).then(async (res) => {
                //If favorties are found
                if(res.status === 200) {
                    //Query edamam for each of them
                    let ingredients = "";
                    ingredients = await getEdamamFromList(res.data);
                    let ingredientsStr = "";
                    for(let i in ingredients) {
                        ingredientsStr += i + "<br>";
                        for(let j in ingredients[i]) {
                            ingredientsStr += "&nbsp;&nbsp;&nbsp;&nbsp;" + ingredients[i][j] + "<br>";
                        }
                    }
                    const windowList = window.open();
                    if (windowList){
                        windowList.document.title = "Grocery List";
                        windowList.document.write(ingredientsStr)
                    }
                    else {
                        alert("Your browser has blocked the popup from opening.")
                    }
                    
                }
            })
            .catch((error) => {
                console.error("Error generating ingredient list.", error);
                alert("An error occured, please try again later.")
            })           
        }

    }

    //Takes in edamam recipe ids and returns the edamam recipe information
    async function getEdamamFromList(res) {
        let urlEdamam = "http://" + window.location.host + "/api/recipe/";
        let returnIngredients = [];

        for(let i = 0; i < res.recipes.length; i++) {
            if(res.ingredients[i].length > 0) {
                returnIngredients.push(JSON.parse(res.ingredients[i]))
            }
            else {
                await axios.get(urlEdamam + res.recipes[i]).then((response) => {
                    if(response.status === 200) {
                        returnIngredients.push(response.data.recipe.ingredients)
                    }
                })
                .catch((error) => {
                    alert.apply("An error occurred when fetching ingredients, please try again later.")
                })                 
            }
        }
        console.log("returns", returnIngredients)
        return parseEdamam(returnIngredients)
    }

    //Takes in an edamam recipe ingredients output, and formats it
    function parseEdamam(ingredients) {
        let ingredientDict = {}
        for(let i = 0; i < ingredients.length; i++) {
            for(let j = 0; j < ingredients[i].length; j++) {
                if(!(ingredients[i][j].food in ingredientDict)) {
                    ingredientDict[ingredients[i][j].food] = [ingredients[i][j].text]
                }
                else {
                    ingredientDict[ingredients[i][j].food].push(ingredients[i][j].text)
                }
            }

        }
        return ingredientDict
    }

    useEffect( () => {
        if(!currUser){
            setLoggedIn(false);
          } else {
            setLoggedIn(true);
            //get favorites list from db when user logged in.
            const url = "http://" + window.location.host + "/api/all-favorites/"+ localStorage.getItem("user");
  
            //if logged in to correct account, get the data:
            if(currUser === username){
                axios.get(url)
                .then((res) => {
                  setRecipeData({
                      loading:false,
                      data:res.data,
                      error:false,
                      default:false
                  })
                  setFilterRecipes(res.data.recipes);
                })
                .catch((error) => {
                  console.error("Error when getting favorite list.", error);
                  if(error.status === 404){
                      //no recipe found
                      setRecipeData({
                          loading:false,
                          data:null,
                          error:false,
                          default:true
                      })
                  } else {
                      //other error
                      setRecipeData({
                          loading:false,
                          data:null,
                          error:true,
                          default:false
                      })
                  }
                })
            }
           
          }
      }, [currUser, username])
    
      //if logged in with CORRECT ACCOUNT, render the search form
    if(loggedIn && currUser === username ){
        search_form = 
        <form onSubmit={handleSubmit}>
        <div className="input-group mb-3 p-3">
        <input data-testid="search_bar" type="text" className="form-control" placeholder="Search in my favorites | Tip: Search by ingredients with brackets, Ex: (flour, egg)" aria-label="favorites keyword" aria-describedby="button-addon2"
        name="keyword" value={searchData} onChange={handleChange} />
        <button className="btn btn-outline-success" type="submit" id="favorites keyword">Search</button>
        </div>
        </form>
    } else if(loggedIn && currUser !== username){
        search_form = null;
        content = <p className="text-center p-3">Please Sign in to view favorites.</p>
    }

    //if not logged in, don't render it
    if(!loggedIn){
        search_form = null;
        content = <p className="text-center p-3">Please Sign in to view favorites.</p>
    }

    if(recipeData.error){
        content = <p className="text-center p-3">An error occured, please try again later.</p>
    }

    if(recipeData.loading){
        content = <p className="text-center p-3">Fetching favorites...</p>
    }

    if(recipeData.default){
        content = <p data-testid="no-recipe-message" className="text-center p-3">No favorite recipes found. You can add to favorites by <Link to="/search">Search</Link></p>
    }

    if(recipeData.data){
        const favoriteList = filterRecipes.map((item) => 
        <div key={item._id}><FavoriteListItem recipeID={item.recipeID} title={item.title}/></div> )
       
        content= <div>
                    <div className="row p-3">
                        <div className="col">
                        <button className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#danger-alert">Remove All Favorites</button>
                        <Link to="/search"><button className="btn btn-outline-primary" >Search more recipes </button></Link>
                        <button className="btn btn-outline-info" onClick={handleGenerateList}>Generate List</button>
                        </div>
                    </div>
                    {filterRecipes.length === 0 ?
                    <p className="text-center p-3">No recipes Found!</p>:
                    favoriteList}
                
                    <div className="modal fade" id="danger-alert" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Alert</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to remove all recipes from favorites? This action is inreversible.
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteAll} data-bs-dismiss="modal">Yes</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
    }

    
    return (
        <>
        <Navbar />
        { search_form}
        { content }
        </>
    )
}

export default Favorites