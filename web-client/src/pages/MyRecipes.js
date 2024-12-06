import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from 'axios'
import UploadListItem from "../components/UploadListItem";

function MyRecipes () {
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);
    const [listData, setListData] = useState({
        data:null,
        error:false,
        default:true
    })

    let content = null;
    const [searchData, setSearchData] = useState('');
    const [filterRecipes, setFilterRecipes] = useState([]);
    
    const handleChange = (e) => {
        const searchItem = e.target.value;
        setSearchData(searchItem);

        //if there is data, do the filtering.
        if(listData.data !== null){
            const filteredRecipes = listData.data.recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchItem.toLowerCase()));
            setFilterRecipes(filteredRecipes);
        }
    };

    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else if (currUser !== null){
          setLoggedIn(true);
          const url = "http://" + window.location.host + "/api/all-uploads/"+ localStorage.getItem("user");
            axios.get(url)
            .then(result => {
                if(result.status === 200){
                    setListData({
                        data: result.data,
                        error: false,
                        default: false
                    })
                    setFilterRecipes(result.data.recipes)
                }
            })
            .catch(error => {console.log(error);
                setListData({
                    data: null,
                    error: true,
                    default: false
                })
            });
            }
    }, [currUser])


    if(listData.data){
        const recipeList = filterRecipes.map((item) => 
            <div key={item._id}><UploadListItem recipeID={item._id} title={item.title}/></div> )

        content = 
        <div className="p-3">
        <input type="text" className="form-control mb-3" placeholder="Keyword" value={searchData} onChange={handleChange}/>
        {recipeList.length === 0 ?
            <p className="text-center p-3">No recipes Found!</p>:
            recipeList}
        </div>
    }

    if(listData.error){
        content = <p className="text-center p-3">An error occured, please try again later.</p>
    }

    if(listData.default){
        content = <p className="text-center p-3">Fetching Uploaded recipes...</p>
    }

    if(loggedIn === false){
        content = <p className="text-center p-3">Please Sign in to view your original recipes.</p>
    }
    return (<>
        <Navbar />
        {content}
    </>)
}

export default MyRecipes;