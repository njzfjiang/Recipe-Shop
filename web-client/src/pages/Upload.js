import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from 'uuid';

function Upload () {
    //check if user is logged in
    const currUser = localStorage.getItem("user");
    const [loggedIn, setLoggedIn] = useState(false);
    let content = null;

    //original ingredient list
    let ingredientList = [];
    const[ingredients, setIngredients] = useState(ingredientList);

    const[recipeInfo, setRecipeInfo]= useState({
        title:'',
        author:'',
        uploader:currUser,
        instructions:'',
        keyword:'',
        recipeImg:''
    })

    //update recipe info for title, author, instructions
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipeInfo(prev => ({
          ...prev,
          [name]: value,
        }));
    };

    function toBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          console.log(reader.result);
          //sets image here.
          setRecipeInfo({
            title:recipeInfo.title,
            author:recipeInfo.author,
            uploader:currUser,
            instructions:recipeInfo.instructions,
            keyword:recipeInfo.keyword,
            recipeImg:reader.result
            });
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
       
     }
    

    const imageUpload = async (e) => {
        setRecipeInfo({
            title:recipeInfo.title,
            author:recipeInfo.author,
            uploader:currUser,
            instructions:recipeInfo.instructions,
            keyword:recipeInfo.keyword,
            recipeImg:''
            });
        //clear the recipeImg...
        let file = e.target.files[0];
        const maxFileSize = 500 * 500;
        if(file) {
            if(file.size <= maxFileSize){
                console.log(file.size);
                await toBase64(file);
                console.log(recipeInfo.recipeImg);
                alert("Image saved.")
            }
            else if (file.size > maxFileSize){
                alert("Failed to save image, the image must be smaller then 976 KB.")
                e.target.value = '';//clear the file
            }
            
        }        
    }

    const handleAdd = (e) =>{
        const new_ingredient = recipeInfo.keyword;
        const new_list = ingredients.concat({name: new_ingredient, id: uuidv4()});
        setIngredients(new_list);
    }

    function handleDelete(ingredientID){
        const index = ingredients.findIndex(item => item.id === ingredientID);
        if(index > -1) {
            const new_array = ingredients.toSpliced(index, 1);
            setIngredients(new_array);
        }
    }

    const handleSubmit =(e) =>{
        e.preventDefault();
        //to upload 
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
        content = 
        <form className = "p-3 mb-3" onSubmit={handleSubmit}>
                <div className="form-group p-3">
                    <label for="title" className="form-label" >Recipe Title:</label>
                    <input type="text" className="form-control mb-3" id="title" placeholder="Recipe Title" name="title" onChange={handleChange}/>
                    <label for="author" className="form-label" >Recipe Author:</label>
                    <input type="text" className="form-control" id="author" placeholder="Author/Source" list="datalistOptions" name="author" onChange={handleChange}/>
                    <datalist id="datalistOptions">
                        <option value= {currUser}/>
                    </datalist>
                </div>
               

                <div className="form-group p-3">
                    <div className="mb-3">
                        <label for="recipeImage" className="form-label">Add Image</label>
                        <input className="form-control" type="file" id="recipeImage" accept=".jpg,.png" onChange={imageUpload}/>
                        <img src={recipeInfo.recipeImg} height="200" alt="preview" />
                    </div>

                    
                    <label for="add-ingredients" className="form-label">Ingredients:</label>
                    <div className="input-group mb-3" >
                        <input type="text" id="add-ingredients" className="form-control" placeholder="Add ingredient here" name="keyword" onChange={handleChange}/>
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleAdd}>Add</button>
                    </div>
                    <ul>
                        {ingredients.map((ingredient)=> 
                            (<li key={ingredient.id}>{ingredient.name}
                            <button type="button" className="btn-close" onClick={()=>handleDelete(ingredient.id)}></button>
                            </li>))}
                    </ul>


                    <label for="recipe-instruction" className="form-label">Instructions:</label>
                    <textarea className="form-control" rows="5" id="recipe-instruction" placeholder="Input recipe instructions here..." name="instructions" onChange={handleChange}></textarea>

                </div>


                <div className="form-group p-3">
                    <button type="submit" className="btn btn-success mb-3">Upload Recipe</button>
                </div>
        </form>
    }
    
    
    if(loggedIn === false)
    {
        content = <p className="text-center p-3">Please Sign in to upload recipes.</p>
    }


    return (
    <>
    <Navbar/>
    {content}
    </>)
}

export default Upload;