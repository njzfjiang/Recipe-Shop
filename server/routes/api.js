const express = require("express");
const router = express.Router();
const axios = require("axios");

//get API key from .env file.
require('dotenv').config();
const App_id = process.env.REACT_APP_app_id;
const App_key = process.env.REACT_APP_app_key;
const edamam_URL = 'https://api.edamam.com/api/recipes/v2';
//get mongo URI from .env file
const MONGO_URI = process.env.REACT_APP_MONGO_URI;

const mongoose = require('mongoose');
const userModel = require('../models/User')
const recipeModel = require('../models/FavoriteRecipe')
const { hashPassword, checkPasswordMatch } = require('../util/encryption.js');

router.use(express.json())

//connect to mongo db
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connection established.");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

//e.g. GET message to 'localhost/api
router.get("/", (req, res) => {
    res.status(200).send("this url path is for api 'localhost/api/*'");
});

//e.g. GET message to 'localhost/api/recipe/search
router.get("/recipe/search", (request, response) => {
    //get query parameters from user input
    const params = {
        type : "public",
        app_id: App_id,
        app_key: App_key,
        q: request.query.keyword,
        mealType: request.query.mealType,
        time: request.query.time,
    }
    let edamam_response = null;

    axios
        .get(edamam_URL, { params })
        .then((res) => {
            edamam_response = res.data;
            //console.log(edamam_response);
            if(edamam_response !== null){
                response.status(200).send(edamam_response);
            }
        })
        .catch((error) => {
            response.status(error.response.status).send(error)
            //console.log(error);
        })
});

//GET message to 'localhost/api/recipe/:recipeID
router.get("/recipe/:recipeID", (request, response) => {
    const params = {
        type : "public",
        app_id: App_id,
        app_key: App_key,
    }

    let recipeID = request.params.recipeID;
    let edamam_response = null;
    axios
        .get(`https://api.edamam.com/api/recipes/v2/${recipeID}`, { params })
        .then((res) => {
            edamam_response = res.data;
            //console.log(edamam_response);
            if(edamam_response !== null){
                response.status(200).send(edamam_response);
            }
        })
        .catch((error) => {
            response.status(error.response.status).send(error)
            //console.log(error);
        })
});

//get message to /api/login
router.get('/login', async (req, res) => {
    try {
        const input_username = req.query.username;
        const input_password = req.query.password;

        const currUser = await userModel.findOne({ username:input_username });
        if (!currUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        if (currUser.password === input_password) {
            return res.status(200).json({ message: 'Login successful!' });
        } else {
            return res.status(401).json({ error: 'Incorrect password.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'failed ' + error.message });
    }
});

//post message to /api/register
router.post('/register',  async (req, res) => {
    try{
    const { username, password, confirmPassword } = req.body;
    const currUser = await userModel.findOne({username})
    if(currUser){
        return res.status(409).json({ error: 'Username already taken' });
    }
    console.log('Password before hashing:', password);
    const hashedPassword = await hashPassword(password);
    console.log('Password after hashing:', hashedPassword);
    const newUser = await userModel.create({ username, hashedPassword, confirmPassword  } )
    return res.status(201).json({ message: 'User registered successfully!', user: newUser });
}
catch(error){
    return res.status(500).json({ error: 'User Registration failed', details: error.message });
    }
   
});

//get message to /api/user-exist
router.get('/user-exist', async(req,res)=> {
    try {
        const user = await userModel.findOne({ username : req.query.username });
    
        if (user) {
          res.status(200).json({ exists: true }); 
        } else {
          res.status(200).json({ exists: false }); 
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})

//POST request to /api/favorites/:recipeID
router.post('/favorites/:recipeID', async(req, res)=>{
    let current_recipeID = req.params.recipeID;
    let current_username = req.query.username;
    let current_title = req.query.title;
    
    try {
        const find_recipe = await recipeModel.findOne({ username: current_username, recipeID: current_recipeID });
        if(find_recipe){
            return res.status(409).json({ error: "Recipe already saved." });
        } else {
            const new_recipe = await recipeModel.create({ username: current_username, recipeID: current_recipeID, title:current_title });
            //console.log(new_recipe)
            return res.status(201).json({ message: 'Recipe stored successfully!', recipe:new_recipe });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

//GET if this recipe is saved in favorite.
router.get('/is-favorite/:recipeID', async(req, res)=>{
    let current_recipeID = req.params.recipeID;
    let current_username = req.query.username;

    try {
        const find_recipe = await recipeModel.findOne({ username: current_username, recipeID: current_recipeID });
        if(find_recipe){
            return res.status(200).json({ saved: true });
        } else {
            return res.status(200).json({ saved: false });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

//GET all favorite recipes from this user
router.get('/all-favorites/:username', async(req, res)=>{
    let current_user = req.params.username;

    try{
        const findRecipes = await recipeModel.find({ username:current_user });
        if(findRecipes){
            //console.log(findRecipes)
            if(findRecipes.length){
                return res.status(200).json({recipes: findRecipes});
            } else {
                return res.status(404).json({error: "No favorite Recipes found."})
            }
        } else {
            return res.status(404).json({error: "No favorite Recipes found."})
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

//delete a specific recipe from favorites
router.delete('/favorites/:recipeID', async(req, res)=>{
    let current_recipeID = req.params.recipeID;
    let current_user = req.query.username;
    
    try{
        const findRecipes = await recipeModel.findOneAndDelete({ username: current_user, recipeID: current_recipeID });
        //console.log("recipe deleted" + findRecipes);
        if(findRecipes){
            return res.status(204).json({message: "Recipe deleted from favorites.", recipeID: current_recipeID});
        } else {
            return res.status(404).json({error: "No matching recipe found in favorites."})
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

router.delete("/all-favorites/:username", async(req, res)=> {
    let current_user = req.params.username;

    try{
        const findRecipes = await recipeModel.deleteMany({ username:current_user });
        if(findRecipes){
            //console.log(findRecipes)
            return res.status(200).json({message: "deleted all recipes from favorites"});
           
        } else {
            return res.status(404).json({error: "No favorite Recipes found."})
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

module.exports = router;