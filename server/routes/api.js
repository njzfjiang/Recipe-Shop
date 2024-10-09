const express = require("express");
const router = express.Router();
const axios = require("axios");

//get API key from .env file.
require('dotenv').config();
const App_id = process.env.REACT_APP_app_id;
const App_key = process.env.REACT_APP_app_key;
const edamam_URL = 'https://api.edamam.com/api/recipes/v2';

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


//e.g. POST message to 'localhost/api/register'
router.post("/register", (req, res) => {
    //console.log(req.body);
    //if register successful
    res.status(200).send("registered");
    //else
    res.status(400).send("invalid username/password")
});

module.exports = router;