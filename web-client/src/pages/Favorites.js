import React, { useState } from "react";
import Navbar from "../components/Navbar";

function Favorites () {
    let content= null;
    const [searchData, setSearchData] = useState({
        keyword:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prevState => ({
          ...prevState,
          [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(searchData.keyword !== ''){
            
        } else {
            alert("Please add a keyword to search.");
        }
    }

    return (
        <>
        <Navbar />
        <form onSubmit={handleSubmit}>
            <div className="input-group mb-3 p-3">
            <input type="text" className="form-control" placeholder="Search in my favorites" aria-label="favorites keyword" aria-describedby="button-addon2"
            name="keyword" value={searchData.keyword} onChange={handleChange} />
            <button className="btn btn-outline-success" type="submit" id="favorites keyword">Search</button>
            </div>
        </form>
        
        { content }
        </>
    )
}

export default Favorites;