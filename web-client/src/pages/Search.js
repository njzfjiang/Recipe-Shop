import React, { useState } from "react";
import Navbar from "../components/Navbar";



function Search() {
    const [searchData, setSearchData] = useState({
        mealType:'',
        mintime:0,
        maxtime:0,
        keyword:'',
        time:'',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prevState => ({
          ...prevState,
          [name]: value,
        }));
        if(searchData.maxtime >= searchData.mintime){
            searchData.time = searchData.mintime +'-'+ searchData.maxtime
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(searchData.keyword !== '') {
            
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
                <input type="number" min="0" className="form-control w-25" name="mintime" value={searchData.mintime} onChange={handleChange} placeholder="0"/>
                <span className ="input-group-text">-</span>
                <input type="number" min="0" className="form-control w-25" name="maxtime" value={searchData.maxtime} onChange={handleChange}placeholder="0"/>
            </div>

            <div className="input-group p-3 mb-3">
            <input type="text" className="form-control" placeholder="Keyword" aria-label="keyword" aria-describedby="recipe-keyword" 
            name="keyword" value={searchData.keyword} onChange={handleChange}/>
            <button className="btn btn-outline-success" type="submit" id="recipe-keyword">Search</button>
            </div>
        </form>

        </>
    )

    
}

export default Search;