const request = require("supertest");
const express = require("express");
const apiRouter = require('../routes/api');
const mockingoose = require('mockingoose');
const favoriteRecipe = require('../models/FavoriteRecipe')
const User = require('../models/User')

const app = new express();
app.use("/api", apiRouter);

afterEach(()=>{
    mockingoose.resetAll()
})

describe("API route tests", () =>{
    test("Default API path: localhost/api/", async () => {
        const res = await request(app).get("/api");
        expect(res.statusCode).toBe(200);
        expect(res.text).toEqual("this url path is for api 'localhost/api/*'");
    });


    test("Recipe Search: localhost/api/recipe/search", async () =>{
        params =  {
            keyword: "eggs",
            mealType: "Breakfast",
            time: "5-60"
        };
        const res = await request(app).get("/api/recipe/search", {params});
        expect(res.statusCode).toBe(200);
    });


    test("Recipe Info: localhost/api/recipe/:recipeID", async () =>{
        const recipeID = "7a844b79a5df3f11e822cc229bfb3981";
        const res = await request(app).get("/api/recipe/" + recipeID);
        expect(res.statusCode).toBe(200);
    });

    test("Error when searching for non-existent recipe", async () =>{
        const recipeID = "122333";
        const res = await request(app).get("/api/recipe/" + recipeID);
        expect(res.statusCode).toBe(404);
    });

    test("POST /api/favorites/ - Error when adding repeated recipes to favorites", async() =>{
        const recipeID = "12345"
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345"}, 'findOne');
        const res = await request(app).post("/api/favorites/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(409);
    })

    test("POST /api/favorites/ - Can add new recipes", async() =>{
        const recipeID = "12345"
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(null, 'findOne');
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345"}, 'create');
        const res = await request(app).post("/api/favorites/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(201);
    })

    test("POST /api/favorites/ - Error when getting system error", async() =>{
        const recipeID = "12345"
        const username = undefined
        mockingoose(favoriteRecipe).toReturn(new Error("Some error."), 'findOne');
        mockingoose(favoriteRecipe).toReturn(new Error("Some error."), 'create');
        const res = await request(app).post("/api/favorites/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(500);
    })

    test("GET /api/is-favorite/ - returns true when got the recipe", async() =>{
        const recipeID = "12345"
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345"}, 'findOne');
        const res = await request(app).get("/api/is-favorite/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(200);
        expect(res.body.saved).toEqual(true);
    })

    test("GET /api/is-favorite/ - returns false when did not get the recipe", async() =>{
        const recipeID = "12345"
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(null, 'findOne');
        const res = await request(app).get("/api/is-favorite/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(200);
        expect(res.body.saved).toEqual(false);
    })

    test("GET /api/is-favorite/ - returns false when did not get the recipe", async() =>{
        const recipeID = "12345"
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(new Error("my error"), 'findOne');
        const res = await request(app).get("/api/is-favorite/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(500);
    })

    test("GET /api/all-favorites/ - returns 200 when got recipes", async() =>{
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345"}, 'find');
        const res = await request(app).get("/api/all-favorites/"+username);
        expect(res.statusCode).toBe(200);
    })

    test("GET /api/all-favorites/ - returns 404 when did not get the recipe", async() =>{
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(null, 'find');
        const res = await request(app).get("/api/all-favorites/"+username);
        expect(res.statusCode).toBe(404);
    })

    test("GET /api/all-favorites/ - returns error when there is an error", async() =>{
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(new Error("my error"), 'find');
        const res = await request(app).get("/api/all-favorites/"+username);
        expect(res.statusCode).toBe(500);
    })

    test("DELETE /api/favorites/:recipeID - returns 204 when recipe deleted", async() =>{
        const recipeID = "12345"
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345"}, 'findOneAndDelete');
        const res = await request(app).delete("/api/favorites/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(204);
    })

    test("DELETE /api/favorites/:recipeID - returns 404 when recipe does not exist", async() =>{
        const recipeID = "12345"
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(null, 'findOneAndDelete');
        const res = await request(app).delete("/api/favorites/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(404);
    })

    test("DELETE /api/favorites/:recipeID - returns 500 when there is an error", async() =>{
        const recipeID = "12345"
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(new Error("my error"), 'findOneAndDelete');
        const res = await request(app).delete("/api/favorites/"+recipeID+"?username="+username);
        expect(res.statusCode).toBe(500);
    })

    test("GET /api/user-exist/ - returns 200 when user exists", async() =>{
        const username = "hehe"
        mockingoose(User).toReturn({username:"hehe", password:"12345"}, 'findOne');
        const res = await request(app).get("/api/user-exist?username="+username);
        expect(res.statusCode).toBe(200);
        expect(res.body.exists).toEqual(true);
    })

    test("GET /api/user-exist/ - returns 200 when user does not exist", async() =>{
        const username = "hehe"
        mockingoose(User).toReturn(null, 'findOne');
        const res = await request(app).get("/api/user-exist?username="+username);
        expect(res.statusCode).toBe(200);
        expect(res.body.exists).toEqual(false);
    })

    test("GET /api/user-exist/ - returns 500 when there is an error", async() =>{
        const username = "hehe"
        mockingoose(User).toReturn(new Error("my error"), 'findOne');
        const res = await request(app).get("/api/user-exist?username="+username);
        expect(res.statusCode).toBe(500);
    })

});

