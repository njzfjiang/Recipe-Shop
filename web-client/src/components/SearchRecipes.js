import bannerImg from '../images/bannerImg.jpg';
import { Link } from 'react-router-dom';

function SearchRecipes() {
    return (
        <div className="card p-3">
            <img src={bannerImg} className="card-img-top" alt="cardImg" height={300}/>
            <div className="card-body">
            <h5 className="card-title">Search for Recipes</h5>
            <p className="card-text">Find the recipes you need based on Keywords.</p>
            <Link to="/search"><button type="button" className="btn btn-outline-success">Search now</button></Link>  
            </div>
        </div>
    )
}

export default SearchRecipes;