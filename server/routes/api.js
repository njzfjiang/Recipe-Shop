const express = require("express");
const router = express.Router();
const axios = require("axios");
const userModel = require('../models/User');

//get API key from .env file.
require('dotenv').config();
const App_id = process.env.REACT_APP_app_id;
const App_key = process.env.REACT_APP_app_key;
const edamam_URL = 'https://api.edamam.com/api/recipes/v2';

router.use(express.json());



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
            console.log(error);
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
            console.log(error);
        })
});


router.post('/register',  async (req, res) => {
    try{
    const { username, password, confirmPassword } = req.body;
    const currUser = await userModel.findOne({username})
    if(currUser){
        return res.status(409).json({ error: 'Username already taken' });
    }
    const newUser = await userModel.create({ username, password, confirmPassword } )
    return res.status(201).json({ message: 'User registered successfully!', user: newUser });
}
catch(error){
    return res.status(500).json({ error: 'User Registration failed', details: error.message });
    }
   
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const currUser = await userModel.findOne({ username });
        if (!currUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        if (currUser.password === password) {
            return res.status(200).json({ message: 'Login successful!' });
        } else {
            return res.status(401).json({ error: 'Incorrect password.' });
        }
    } catch (error) {
        return res.status(500).json("failed "+ error);
    }
});


router.get('/user-exist', async(req,res)=> {
    try {
        const { username } = req.body;
        const user = await userModel.findOne({ username });
    
        if (user) {
          return res.status(200).json({ exists: true }); 
        } else {
          return res.status(200).json({ exists: false }); 
        }
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
});

module.exports = router;
