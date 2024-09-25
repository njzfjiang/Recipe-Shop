import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import MainBanner from './components/MainBanner';
import SearchRecipes from './components/SearchRecipes';

function App(){
  return (
    <>
    <Navbar />
    <MainBanner />
    <SearchRecipes />
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


