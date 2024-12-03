const express = require("express");
const router = express.Router();
const axios = require("axios");
const rateLimit = require("express-rate-limit");

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

const limiter = rateLimit({
    windowMs:15*60*1000,
    max: 100,
})

router.use(limiter);
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

    //test if recipeID is alphanumeric
    let recipeID = request.params.recipeID;
    const recipeIDPattern = /^[a-zA-Z0-9]+$/;
    if (!recipeIDPattern.test(recipeID)) {
        return response.status(400).send({ error: "Invalid recipeID format" });
    }

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
router.post('/login', async (req, res) => {
    try {
        const input_username = req.body.username;
        const input_password = req.body.password;

        const currUser = await userModel.findOne({ username: {$eq: input_username} });
        if (!currUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const isPasswordValid = await checkPasswordMatch(input_password,currUser.password)
        if (isPasswordValid) {
            return res.status(200).json({ message: 'Login successful!' });
        } else {
            return res.status(401).json({ error: 'Incorrect username or password' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'failed ' + error.message });
    }
});

//post message to /api/register
router.post('/register',  async (req, res) => {
    try{
    const { username, password, confirmPassword } = req.body;
    if(typeof username !== "string"){
        return res.status(400).json({ error:'Bad Request'})  
    }

    const currUser = await userModel.findOne({username})
    if(currUser){
        return res.status(409).json({ error: 'Username already taken' });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await userModel.create({ username, password: hashedPassword, confirmPassword: hashedPassword  } )
    return res.status(201).json({ message: 'User registered successfully!', user: newUser });
}
catch(error){
    console.log(error);
    return res.status(500).json({ error: 'User Registration failed', details: error.message });
    }
   
});

//get message to /api/user-exist
router.get('/user-exist', async(req,res)=> {
    try {
        const user = await userModel.findOne({ username : {$eq: req.query.username} });
    
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
    let current_ingredients = req.query.ingredients;
    //Add ingredient param here
    console.log(req.params, req.query)
    
    try {
        const find_recipe = await recipeModel.findOne({ username: {$eq: current_username}, recipeID: {$eq: current_recipeID} });
        if(find_recipe){
            return res.status(409).json({ error: "Recipe already saved." });
        } else {
            const new_recipe = await recipeModel.create({ username: current_username, recipeID: current_recipeID, title:current_title, ingredients:current_ingredients.split(',') });
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
        const find_recipe = await recipeModel.findOne({ username: {$eq: current_username}, recipeID: {$eq:current_recipeID} });
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
        const findRecipes = await recipeModel.find({ username:{$eq: current_user} });
        if(findRecipes){
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
        const findRecipes = await recipeModel.findOneAndDelete({ username: {$eq:current_user}, recipeID: {$eq:current_recipeID} });
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

//GET the ingredients of favorited recipes
router.get("/generate-list/:username", async(req, res)=> {
    let current_user = req.params.username;
    //REWORK THIS, currently only returns recipeID, but we want for it to check if there already is ingredients in the db
    try{
        const findRecipes = await recipeModel.find({ "username":current_user });
        if(findRecipes) {
            if(findRecipes.length){
                let ingDB = findRecipes.map(findRecipes => findRecipes.ingredients);
                const recipeID = findRecipes.map(findRecipes => findRecipes.recipeID);
                return res.status(200).json({recipes: recipeID, ingredients: ingDB});
            } else {
                return res.status(404).json({error: "No favorite Recipes found."})
            }
        } else {
            return res.status(404).json({error: "No favorite Recipes exist."})
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})


module.exports = router;