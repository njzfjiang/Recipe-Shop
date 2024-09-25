import recipes from '../images/Recipes.jpg';

function FavoriteRecipes() {
    return (
        <div className="card p-3">
            <img src={recipes} className="card-img-top" alt="cardImg" height={300}/>
            <div className="card-body">
            <h5 className="card-title">Favourite recipes</h5>
            <p className="card-text">Manage and view your favourite recipes.</p>
            <a href="#" className="btn btn-primary">Manage</a>
            </div>
        </div>
    )
}

export default FavoriteRecipes;