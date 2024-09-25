import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import MainBanner from './components/MainBanner';
import SearchRecipes from './components/SearchRecipes';
import GenerateGroceryList from './components/GenerateGroceryList';
import FavoriteRecipe from './components/FavoriteRecipes';

function App(){
  return (
    <>
    <Navbar />
    <MainBanner />
    <div class="container text-center">
      <div class="row">
        <div class="col">
          <SearchRecipes />
        </div>
        <div class="col">
         <GenerateGroceryList />
        </div>
        <div class="col">
          <FavoriteRecipe />
        </div>
      </div>
    </div>
    
    
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


