import logo from "../images/logo-transparent-png.png";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
      <a className="navbar-brand">
        <img src={logo} alt="Logo" width="56" height="50" className="d-inline-block align-text-top"></img>
        Recipe Shop
        </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link to="/"><button type="button" class="btn btn-light">Home</button></Link>
          </li>
          <li className="nav-item">
            <Link to="/login"><button type="button" class="btn btn-light">Sign In</button></Link>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              About
            </a>
            <ul className="dropdown-menu">
              <li><Link to="/about-us"><a className="dropdown-item">About Us</a></Link></li>
              <li><a className="dropdown-item" href="https://developer.edamam.com/edamam-docs-recipe-api">Edamam API</a></li>
              <li><hr className="dropdown-divider"/></li>
              <li><a className="dropdown-item" href="https://github.com/njzfjiang/Recipe-Shop">GitHub Repo</a></li>
            </ul>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" aria-disabled="true">Mobile version</a>
          </li>
         
        </ul>
        
      </div>
    </div>
  </nav>
    )
  }

