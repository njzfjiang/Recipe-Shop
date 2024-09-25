import Grocery from '../images/Grocery.jpg';

function GenerateGroceryList() {
    return (
        <div className="card p-3">
            <img src={Grocery} className="card-img-top" alt="cardImg" height={300}/>
            <div className="card-body">
            <h5 className="card-title">Generate Grocery list</h5>
            <p className="card-text">Generate a grocery list based on selected recipes.</p>
            <a href="#" className="btn btn-primary">Select Recipes</a>
            </div>
        </div>
    )
}

export default GenerateGroceryList;