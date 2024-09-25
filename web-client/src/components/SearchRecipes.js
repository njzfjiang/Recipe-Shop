import bannerImg from '../images/bannerImg.jpg';

function SearchRecipes() {
    return (
        <div className="card p-3">
            <img src={bannerImg} className="card-img-top" alt="cardImg" height={300}/>
            <div className="card-body">
            <h5 className="card-title">Search for Recipes</h5>
            <p className="card-text">Find the recipes you need based on Keywords.</p>
            <a href="#" className="btn btn-primary">Search now</a>
            </div>
        </div>
    )
}

export default SearchRecipes;