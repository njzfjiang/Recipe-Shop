import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MainBanner from '../components/MainBanner';
import SearchRecipes from '../components/SearchRecipes';
import GenerateGroceryList from '../components/GenerateGroceryList';
import FavoriteRecipe from '../components/FavoriteRecipes';

function Home(){
  let promotion = null;
  const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);


    useEffect( () => {
        if(!currUser){
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
        }
      }, [currUser])
    
    if(loggedIn){
        promotion = <p></p>
    }
    
    if(!loggedIn){
        promotion = <MainBanner />
    }

  return (
    <>
    <Navbar />
    {promotion}
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <SearchRecipes />
        </div>
        <div className="col">
          <GenerateGroceryList />
        </div>
        <div className="col">
          <FavoriteRecipe />
        </div>
      </div>
    </div>
    </>
  )
}

export default Home;
