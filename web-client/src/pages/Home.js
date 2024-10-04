import React from 'react';
import Navbar from '../components/Navbar';
import MainBanner from '../components/MainBanner';
import SearchRecipes from '../components/SearchRecipes';
import GenerateGroceryList from '../components/GenerateGroceryList';
import FavoriteRecipe from '../components/FavoriteRecipes';

function Home(){
  return (
    <>
    <Navbar />
    <MainBanner />
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
