import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import { useNavigate } from "react-router-dom";

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
        privacy:'public',
        image:''
    });

    const navigate = useNavigate()

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
            privacy:recipeInfo.privacy,
            image:reader.result
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
            privacy:recipeInfo.privacy,
            image:''
            });
        //clear the image file.
        let file = e.target.files[0];
        const maxFileSize = 500 * 500;
        if(file) {
            if(file.size <= maxFileSize){
                console.log(file.size);
                await toBase64(file);
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
        if(recipeInfo.title !== "" && recipeInfo.instructions !== ""){
            if(ingredients.length>0){
                let parsedIngredients = ingredients.map(item => item.name)
                //parse only the value of the "name" object from the display array

                const params = {
                    title: recipeInfo.title,
                    source: recipeInfo.author,
                    username: recipeInfo.uploader,
                    ingredients: parsedIngredients,
                    instructions: recipeInfo.instructions,
                    image: recipeInfo.image,
                    privacy: recipeInfo.privacy
                }
                const url = "http://" + window.location.host + "/api/recipe/upload";

                axios.post(url, params)
                .then(result => {
                    console.log(result);
                    if(result.status === 201){
                        alert("Upload Successful!");
                        setTimeout(() => {
                            navigate('/my-recipes');
                            }, 2000);
                    }
                    else{
                        alert("Upload Failed, please try again later.");
                    }
                })
                .catch(error => {console.log(error);
                    alert("Upload Failed, please try again later.");
                });
            }
        }
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
                    <label htmlFor="title" className="form-label" >Recipe Title:</label>
                    <input type="text" className="form-control mb-3" id="title" placeholder="Recipe Title" name="title" onChange={handleChange}/>
                    <label htmlFor="author" className="form-label" >Recipe Author:</label>
                    <input type="text" className="form-control" id="author" placeholder="Author/Source" list="datalistOptions" name="author" onChange={handleChange}/>
                    <datalist id="datalistOptions">
                        <option value= {currUser}/>
                    </datalist>
                </div>
               

                <div className="form-group p-3">
                    <div className="mb-3">
                        <label htmlFor="recipeImage" className="form-label">Add Image</label>
                        <input className="form-control" type="file" id="recipeImage" accept=".jpg,.png" onChange={imageUpload}/>
                        <img src={recipeInfo.image} style={{width:250, height:250}}  alt="preview"/>
                    </div>

                    
                    <label htmlFor="add-ingredients" className="form-label">Ingredients:</label>
                    <div className="input-group mb-3" >
                        <input id="add-ingredients" type="text" className="form-control" placeholder="Add ingredient here" name="keyword" onChange={handleChange}/>
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleAdd}>Add</button>
                    </div>
                    <ul>
                        {ingredients.map((ingredient)=> 
                            (<li key={ingredient.id}>{ingredient.name}
                            <button type="button" className="btn-close" onClick={()=>handleDelete(ingredient.id)}></button>
                            </li>))}
                    </ul>


                    <label htmlFor="recipe-instruction" className="form-label">Instructions:</label>
                    <textarea className="form-control" rows="5" id="recipe-instruction" placeholder="Input recipe instructions here..." name="instructions" onChange={handleChange}></textarea>

                </div>

                <div className="input-group p-3 w-50">
                    <span className="input-group-text">Privacy</span>
                    <select className="form-select" name="privacy" value={recipeInfo.privacy} onChange={handleChange}>
                        <option>public</option>
                        <option>private</option>
                    </select>
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