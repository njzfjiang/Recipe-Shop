import React, { useEffect, useState } from "react";
import logo from "../images/logo-transparent-png.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const currUser = localStorage.getItem("user")
    const [loggedIn, setLoggedIn] = useState(false)
    let LoginButton = null;
    let userMessage = null;
    let uploadButton = null;
    let myRecipes = null;

    const handleLogout = (e) =>{
      e.preventDefault();
      localStorage.clear();
      setLoggedIn(false);
      
      setTimeout(() => {
        //navigate to homepage and refresh
        navigate('/');
        navigate(0);
        }, 2000); 
      alert("Logging out.")
    }

    useEffect( () => {
      if(!currUser){
        setLoggedIn(false);
      } else if (currUser !== null){
        setLoggedIn(true);
      }
    }, [currUser])
    
    if(loggedIn === true)
    {
      LoginButton =
      <button type="button" className="btn btn-dark" onClick={handleLogout}>Log out</button>
      uploadButton =
      <Link to="/upload"><button type="button" className="btn btn-outline-success">Upload My Recipe</button></Link>
      myRecipes = 
      <Link to="/my-recipes"><button type="button" className="btn btn-light">My Recipes</button></Link>
      userMessage = "Hello, " + currUser;
    }


    if(loggedIn === false)
    {
      LoginButton = 
        <Link to="/login"><button type="button" className="btn btn-light">Sign In</button></Link>
       userMessage = "Hello, guest";
    }

    return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
      <p className="navbar-brand">
        <img src={logo} alt="Logo" width="56" height="50" className="d-inline-block align-text-top"></img>
        Recipe Shop
        </p>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to="/"><button type="button" className="btn btn-light">Home</button></Link>
          </li>
          <li className="nav-item">
            {LoginButton}
          </li>
          <li className="nav-item dropdown">
            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              About
            </button>
            <ul className="dropdown-menu">
              <li><Link to="/about-us"><button className="dropdown-item">About Us</button></Link></li>
              <li><a className="dropdown-item" href="https://developer.edamam.com/edamam-docs-recipe-api">Edamam API</a></li>
              <li><hr className="dropdown-divider"/></li>
              <li><a className="dropdown-item" href="https://github.com/njzfjiang/Recipe-Shop">GitHub Repo</a></li>
            </ul>
          </li>
          <li className="nav-item">
             {myRecipes}
          </li>
          <li className="nav-item">
            {uploadButton}
          </li>
        </ul>
        <span className="navbar-text">
            {userMessage}
        </span>
      </div>
    </div>
  </nav>
    )
  }

  export default Navbar;
