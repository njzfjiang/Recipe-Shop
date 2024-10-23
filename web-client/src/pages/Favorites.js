import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";

function Favorites () {
    //check if user is logged in
    let search_form = null;
    const { username } = useParams();
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);
    
    //search data
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

    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
          //axios.get()
        }
      }, [currUser])
    
      //if logged in with CORRECT ACCOUNT, render the search form
    if(loggedIn && currUser === username ){
        search_form = 
        <form onSubmit={handleSubmit}>
        <div className="input-group mb-3 p-3">
        <input type="text" className="form-control" placeholder="Search in my favorites" aria-label="favorites keyword" aria-describedby="button-addon2"
        name="keyword" value={searchData.keyword} onChange={handleChange} />
        <button className="btn btn-outline-success" type="submit" id="favorites keyword">Search</button>
        </div>
        </form>
        content = <></>
    } else if(loggedIn && currUser !== username){
        search_form = null;
        content = <p className="text-center p-3">Please Sign in to view favorites.</p>
    }

    //if not logged in, don't render it
    if(!loggedIn){
        search_form = null;
        content = <p className="text-center p-3">Please Sign in to view favorites.</p>
    }

    return (
        <>
        <Navbar />
        { search_form}
        { content }
        </>
    )
}

export default Favorites;