import React from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";

function Search() {
    return (
        <>
        <Navbar />
        <form>
            <div className="input-group p-3 w-50">
                <span className="input-group-text">Meal Type</span>
                <select className="form-select" id="meal-type">
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
                <input type="number" min="0" className="form-control w-25" id="min-time" placeholder="0"/>
                <span className ="input-group-text">-</span>
                <input type="number" min="0" className="form-control w-25" id="max-time" placeholder="0"/>
            </div>

            <div className="input-group p-3 mb-3">
            <input type="text" className="form-control" placeholder="Keyword" aria-label="keyword" aria-describedby="recipe-keyword"/>
            <button class="btn btn-outline-success" type="submit" id="recipe-keyword">Search</button>
            </div>
        </form>

        <h5 className="px-3">Popular Recipes:</h5>
        <RecipeCard title="French Fries" imgSrc={"https://images.stockcake.com/public/d/f/6/df64bdb5-f32a-4726-861c-29244c265770/tempting-french-fries-stockcake.jpg"}/>
        </>
    )
}

export default Search;