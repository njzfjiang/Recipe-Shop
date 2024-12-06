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
const userRecipeModel = require('../models/UserRecipe.js')
const { hashPassword, checkPasswordMatch } = require('../util/encryption.js');

const limiter = rateLimit({
    windowMs:15*60*1000,
    max: 100,
})

router.use(limiter);
router.use(express.json({limit: '100mb'}))



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
router.get("/recipe/search", async(request, response) => {
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
    let local_recipes = null;
    let fullResponse = null;


    try{
        local_recipes = await userRecipeModel.find({title: { $regex: request.query.keyword, $options: "i"}, privacy:"public"}).limit(20);
        for(let i=0; i<local_recipes.length; i++){
            local_recipes[i] = {find_recipe: local_recipes[i]};
        }
    }catch(error){
        console.log("Unable to get local recipes");
        console.log(error);
        local_recipes = [];
    }

    axios
        .get(edamam_URL, { params })
        .then((res) => {
            edamam_response = res.data;
            if(edamam_response !== null){
                fullResponse = edamam_response;
                fullResponse.local = local_recipes;
                response.status(200).send(fullResponse);
            }
        })
        .catch((error) => {
            console.log(error);
            response.status(error.response.status).send(error)
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
            if(edamam_response !== null){
                response.status(200).send(edamam_response);
            }
        })
        .catch((error) => {
            console.log(error);
            response.status(error.response.status).send(error)
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

    if(password == confirmPassword && password.length > 0){
        const currUser = await userModel.findOne({username})
        if(currUser){
            return res.status(409).json({ error: 'Username already taken' });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await userModel.create({ username, password: hashedPassword, confirmPassword: hashedPassword  } )
        return res.status(201).json({ message: 'User registered successfully!', user: newUser });
    }
    else{
        return res.status(409).json({ error: "Invalid password. Empty or doesn't match confirm password" });
    }
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
    let current_source = req.query.source;
    let current_ingredients = req.query.ingredients;
    
    try {
        const find_recipe = await recipeModel.findOne({ username: {$eq: current_username}, recipeID: {$eq: current_recipeID}, source: {$eq: current_source}});
        if(find_recipe){
            return res.status(409).json({ error: "Recipe already saved." });
        } else {
            const new_recipe = await recipeModel.create({ username: current_username, recipeID: current_recipeID, title:current_title, source:current_source, ingredients:current_ingredients.split(',') });
            return res.status(201).json({ message: 'Recipe stored successfully!', recipe:new_recipe });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
})

//GET if this recipe is saved in favorite.
router.get('/is-favorite/:recipeID', async(req, res)=>{
    let current_recipeID = req.params.recipeID;
    let current_username = req.query.username;
    let current_source = req.query.source;

    try {
        const find_recipe = await recipeModel.findOne({ username: {$eq: current_username}, recipeID: {$eq:current_recipeID}, source: {$eq: current_source}});
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
    let current_source = req.query.source;
    
    try{
        const findRecipes = await recipeModel.findOneAndDelete({ username: {$eq:current_user}, recipeID: {$eq:current_recipeID}, source:{$eq:current_source} });
        console.log("recipe deleted" + findRecipes);
        if(findRecipes){
            return res.status(204).json({message: "Recipe deleted from favorites.", recipeID: current_recipeID});
        } else {
            return res.status(404).json({error: "No matching recipe found in favorites."})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
})

router.delete("/all-favorites/:username", async(req, res)=> {
    let current_user = req.params.username;

    try{
        const findRecipes = await recipeModel.deleteMany({ username:current_user });
        if(findRecipes){
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
    try{
        const findRecipes = await recipeModel.find({ "username":current_user }, 'recipeID').exists("source", false);
        const localRecipes = await recipeModel.find({ "username":current_user }, 'recipeID', {"source": "recipe-shop"}).exists("source", true);
        if(findRecipes || localRecipes) {
            if(findRecipes.length || localRecipes.length){
                let ingDB = findRecipes.map(findRecipes => findRecipes.ingredients);
                const recipeID = findRecipes.map(findRecipes => findRecipes.recipeID);
                const localID = localRecipes.map(localRecipes => localRecipes.recipeID);;
                return res.status(200).json({recipes: recipeID, localRecipes: localID, ingredients: ingDB});
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


//post message to /api/recipe/upload
router.post('/recipe/upload',  async (req, res) => {
    try{
        const { title, source, username, ingredients, instructions, image, privacy } = req.body;
        if(title.length > 0 && ingredients.length > 0, instructions.length > 0 && privacy.length > 0){
            const currUser = await userModel.findOne({username:{$eq:username}});
            if(currUser){
                //user exists
                const newRecipe = await userRecipeModel.create({title, source, username, ingredients, instructions, image, privacy, recipeShop:true});
                return res.status(201).json({message: "Recipe uploaded successfully!", recipe: newRecipe})
            }
            else{
                //user does not exist
                return res.status(404).json({ error: "Uploader username does not exist."});
            }
        }
        else{
            return res.status(409).json({ error: "One or more required parameter is empty: Title, Ingredients, Instructions, Privacy." });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Recipe upload failed', details: error.message });
    }
});


//GET all uploaded recipes from this user
router.get('/all-uploads/:username', async(req, res)=>{
    let current_user = req.params.username;

    try{
        const findRecipes = await userRecipeModel.find({ username:current_user });
        if(findRecipes){
            if(findRecipes.length){
                return res.status(200).json({recipes: findRecipes});
            } else {
                return res.status(404).json({error: "No uploaded Recipes found."})
            }
        } else {
            return res.status(404).json({error: "No uploaded Recipes found."})
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//delete a specific recipe from user uploads
router.delete('/uploads/:recipeID', async(req, res)=>{
    let current_recipeID = req.params.recipeID;
    let current_user = req.query.username;
    
    try{
        const findRecipes = await userRecipeModel.findOneAndDelete({ username: {$eq:current_user}, _id: {$eq:current_recipeID} });
        if(findRecipes){
            const favsDeleted = await recipeModel.deleteMany({recipeID: current_recipeID, source: "recipe-shop"});
            //console.log(favsDeleted);
            return res.status(204).json({message: "Recipe deleted from uploads.", recipeID: current_recipeID});
        } else {
            return res.status(404).json({error: "No matching recipe found in uploads."})
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//GET if this recipe is uploaded by user.
router.get('/is-upload/:recipeID', async(req, res)=>{
    let current_recipeID = req.params.recipeID;
    let current_username = req.query.username;

    try {
        const find_recipe = await userRecipeModel.findOne({ username: {$eq:current_username}, _id: {$eq:current_recipeID} });
        if(find_recipe){
            return res.status(200).json({ uploaded: true });
        } else {
            return res.status(200).json({ uploaded: false });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//GET message to 'localhost/api/recipe/upload/:recipeID
router.get("/recipe/upload/:recipeID", async(req, res) => {
    let current_recipeID = req.params.recipeID;

    try {
        const find_recipe = await userRecipeModel.findOne({_id: current_recipeID });
        if(find_recipe){
            return res.status(200).json({ find_recipe });
        } else {
            return res.status(404).json({ error: "Recipe not found!" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;