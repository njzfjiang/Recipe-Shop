import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import { arrayChunk } from "../utils/arrayChunk";


function Search() {
    let content = null;

    const [searchData, setSearchData] = useState({
        mealType:'',
        mintime:0,
        maxtime:0,
        keyword:'',
        time:null,
    });

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
    },[])

    //update form data with user input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prevState => ({
          ...prevState,
          [name]: value,
        }));
    };



    //search for recipes when user submit the form
    const handleSubmit = (e) => {
        e.preventDefault();
         //validate user input:
         if(searchData.maxtime !== 0 && 
            (searchData.maxtime > searchData.mintime)){
            searchData.time = searchData.mintime +'-'+ searchData.maxtime;
        }
        let inputMealType = "";
        if(searchData.mealType === ''){
            inputMealType = null;
        } else {
            inputMealType = searchData.mealType;
        }
        const params = {
            keyword: searchData.keyword,
            mealType: inputMealType,
            time: searchData.time,
        }

        //if the search keyword is not empty, fetch data from the API.
        if(searchData.keyword !== '') {
            axios
                .get("http://localhost/api/recipe/search", {params})
                .then((res) => {
                    setRecipeData({
                        loading: false,
                        data: res.data,
                        error: false,});
                })
                .catch((error) => {
                    //console.log(error);
                    setRecipeData({
                        loading:false,
                        data: null,
                        error:true,})
                })
        }
        else {
            alert("Please add a keyword to search.");
        } 
    } 
    
    //load dynamic data based on recipes searched
    if(recipeData.error){
        content = <p className="p-3">An error occured, pleast try again later.</p>
    }

    if(recipeData.loading){
        content = <p className="p-3">Fetching Recipes...</p>
    }

    //render content if there is data.
    if(recipeData.data){
        //const recipe_list = JSON.parse(recipeData.data);
        if(recipeData.data.to === 0){
            content = <p className="p-3">No matching recipes found.</p>
        } else {
            content = 
            <div>
                 {arrayChunk(recipeData.data.hits, 4).map((row, i) => (
                    <div key={i} className="row mx-auto p-3">
                        {row.map((col, i) => (
                                <RecipeCard recipe={col}/>
                            ))}
                    </div>
                 ))}
            </div>
           
            
        } 
    }

    return (
        <>
        <Navbar />
        <form onSubmit={handleSubmit}>
            <div className="input-group p-3 w-50">
                <span className="input-group-text">Meal Type</span>
                <select className="form-select" name="mealType" value={searchData.mealType} onChange={handleChange}>
                    <option>--meal type--</option>
                    <option>Breakfast</option>
                    <option>Dinner</option>
                    <option>Lunch</option>
                    <option>Snack</option>
                    <option>Teatime</option>
                </select>
            </div>

            <div className="input-group px-3">
                <span className="input-group-text">Cooking Time</span>
                <input data-testid="min_time" type="number" min="0" className="form-control w-25" name="mintime" value={searchData.mintime} onChange={handleChange} placeholder="0"/>
                <span className ="input-group-text">-</span>
                <input data-testid="max_time" type="number" min="0" className="form-control w-25" name="maxtime" value={searchData.maxtime} onChange={handleChange}placeholder="0"/>
            </div>

            <div className="input-group p-3 mb-3">
            <input type="text" className="form-control" placeholder="Keyword" aria-label="keyword" aria-describedby="recipe-keyword" 
            name="keyword" value={searchData.keyword} onChange={handleChange}/>
            <button className="btn btn-outline-success" type="submit" id="recipe-keyword">Search</button>
            </div>
        </form>

        <div className="p-3">
            {content}
        </div>
        
        </>
    )

    
}

export default Search;