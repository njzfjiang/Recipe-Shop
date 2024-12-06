const request = require("supertest");
const express = require("express");
const apiRouter = require('../routes/api');
const mockingoose = require('mockingoose');
const favoriteRecipe = require('../models/FavoriteRecipe')
const userRecipeModel = require('../models/UserRecipe.js')
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
        const ingredient = "test,test2"
        mockingoose(favoriteRecipe).toReturn(null, 'findOne');
        mockingoose(favoriteRecipe).toReturn(null, 'findOne');
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345", ingredients:"test,test2"}, 'create');
        const res = await request(app).post("/api/favorites/"+recipeID+"?username="+username+"&ingredients="+ingredient);
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
        mockingoose(favoriteRecipe).toReturn([{username:"hehe", recipeID:"12345"}], 'find');
        const res = await request(app).get("/api/all-favorites/"+username);
        expect(res.statusCode).toBe(200);
    })

    test("GET /api/all-favorites/ - returns 404 when did not get the recipe", async() =>{
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(null, 'find');
        const res = await request(app).get("/api/all-favorites/"+username);
        expect(res.statusCode).toBe(404);
    })

    test("GET /api/all-favorites/ - returns 404 when did not get the recipe", async() =>{
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn([], 'find');
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

    test("DELETE /api/all-favorites/ - returns 200 when got recipes", async() =>{
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn([{username:"hehe", recipeID:"12345"}], 'deleteMany');
        const res = await request(app).delete("/api/all-favorites/"+username);
        expect(res.statusCode).toBe(200);
    })


    test("DELETE /api/all-favorites/ - returns 404 when no recipes found", async() =>{
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(null, 'deleteMany');
        const res = await request(app).delete("/api/all-favorites/"+username);
        expect(res.statusCode).toBe(404);
    })

    test("DELETE /api/all-favorites/ - returns 500 when error occured", async() =>{
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(new Error("my error"), 'deleteMany');
        const res = await request(app).delete("/api/all-favorites/"+username);
        expect(res.statusCode).toBe(500);
    })

    test("GET api/generate-list/ - returns 200 when list generated", async() => {
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn([{recipeID:"7a844b79a5df3f11e822cc229bfb3981"},{recipeID:"4b0b3b47bac3466eafe3f360729b69d3"}], 'find');
        const res = await request(app).get("/api/generate-list/" + username);
        expect(res.statusCode).toBe(200);
    })

    test("GET api/generate-list/ - returns 404 when no user is specified", async() => {
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn(null, 'find');
        const res = await request(app).get("/api/generate-list/" + username);
        expect(res.statusCode).toBe(404);
    })

    test("GET api/generate-list/ - returns 404 when no user is found, but has no favorited recipes", async() => {
        const username = "hehe"
        mockingoose(favoriteRecipe).toReturn([], 'find');
        const res = await request(app).get("/api/generate-list/" + username);
        expect(res.statusCode).toBe(404);
    })

    test("GET api/generate-list/ - returns 500 when error occured", async() => {
        const username = "NO_USER"
        mockingoose(favoriteRecipe).toReturn(new Error("my error"), "find");
        const res = await request(app).get("/api/generate-list/" + username);
        expect(res.statusCode).toBe(500);
    })

    test("GET api/recipe/upload - returns 201 on success", async() => {
        const username = "hehe"
        mockingoose(User).toReturn({username:"hehe", password:"12345"}, 'findOne');
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345", ingredients:"test,test2"}, 'create');
        const testData = {
            title: "testTitle",
            ingredients: ["testIng1", "testIng2"],
            instructions: ["testInst1", "testInst2"],
            privacy: "testPriv"
        }
        const res = await request(app).post("/api/recipe/upload").send(testData);
        expect(res.statusCode).toBe(201);
    })

    test("GET api/recipe/upload - returns 409 on missing data", async() => {
        const username = "hehe"
        mockingoose(User).toReturn({username:"hehe", password:"12345"}, 'findOne');
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345", ingredients:"test,test2"}, 'create');
        const testData = {
            title: "testTitle",
            ingredients: ["testIng1", "testIng2"],
            instructions: [],
            privacy: "testPriv"
        }
        const res = await request(app).post("/api/recipe/upload").send(testData);
        expect(res.statusCode).toBe(409);
    })

    test("GET api/recipe/upload - returns 500 on malformed data", async() => {
        const username = "hehe"
        mockingoose(User).toReturn(null, 'findOne');
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345", ingredients:"test,test2"}, 'create');
        const testData = null
        const res = await request(app).post("/api/recipe/upload").send(testData);
        expect(res.statusCode).toBe(500);
    })

    test("GET api/recipe/upload - returns 404 on null user", async() => {
        const username = "hehe"
        mockingoose(User).toReturn(null, 'findOne');
        mockingoose(favoriteRecipe).toReturn({username:"hehe", recipeID:"12345", ingredients:"test,test2"}, 'create');
        const testData = {
            title: "testTitle",
            ingredients: ["testIng1", "testIng2"],
            instructions: ["testInst1", "testInst2"],
            privacy: "testPriv"
        }
        const res = await request(app).post("/api/recipe/upload").send(testData);
        expect(res.statusCode).toBe(404);
    })


    test("GET api/all-uploads/:username - returns 200 on success", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn([{title:"testTitle",
                                            source:"testSource",
                                            username:"testUser",
                                            ingredients:"testIng1,testIng2",
                                            image:"testImage",
                                            privacy:"testPriv",
                                            comments:[{commenter:"testCommenter",comment:"testComment"}],
                                            recipeShop:true}],
                                            'find');
        const testData = {username:username}
        const res = await request(app).get("/api/all-uploads/" + username).send(testData);
        expect(res.statusCode).toBe(200);
    })

    test("GET api/all-uploads/:username - returns 404 on no uploaded recipes", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn([],'find');
        const testData = {username:username}
        const res = await request(app).get("/api/all-uploads/" + username).send(testData);
        expect(res.statusCode).toBe(404);
    })

    test("GET api/all-uploads/:username - returns 404 on no user found", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn(null,'find');
        const testData = {username:username}
        const res = await request(app).get("/api/all-uploads/" + username).send(testData);
        expect(res.statusCode).toBe(404);
    })

    test("GET api/all-uploads/:username - returns 500 on error", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn(new Error("test Error"),'find');
        const testData = {username:username}
        const res = await request(app).get("/api/all-uploads/" + username).send(testData);
        expect(res.statusCode).toBe(500);
    })


    test("GET api/uploads/:recipeID - returns 204 on success", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn({username:username, _id:"testID"}, 'findOneAndDelete');
        const testData = {username:username}
        const res = await request(app).delete("/api/uploads/testID").send(testData);
        expect(res.statusCode).toBe(204);
    })

    test("GET api/uploads/:recipeID - returns 404 on recipe not found", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn(null, 'findOneAndDelete');
        const testData = {username:username}
        const res = await request(app).delete("/api/uploads/testID").send(testData);
        expect(res.statusCode).toBe(404);
    })

    test("GET api/uploads/:recipeID - returns 500 on error", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn(new Error("testError"), 'findOneAndDelete');
        const testData = {username:username}
        const res = await request(app).delete("/api/uploads/testID").send(testData);
        expect(res.statusCode).toBe(500);
    })


    test("GET api/uploads/:recipeID - returns 200 on true and success", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn({username:username, _id:"testID"}, 'findOne');
        const testData = {username:username}
        const res = await request(app).get("/api/is-upload/" + username).send(testData);
        expect(res.statusCode).toBe(200);
        expect(res.body.uploaded).toBe(true);
    })

    test("GET api/uploads/:recipeID - returns 200 on false and success", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn(null, 'findOne');
        const testData = {username:username}
        const res = await request(app).get("/api/is-upload/" + username).send(testData);
        expect(res.statusCode).toBe(200);
        expect(res.body.uploaded).toBe(false);
    })

    test("GET api/uploads/:recipeID - returns 200 on true and success", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn(new Error("testError"), 'findOne');
        const testData = {username:username}
        const res = await request(app).get("/api/is-upload/" + username).send(testData);
        expect(res.statusCode).toBe(500);
    })


    test("GET api/recipe/upload/:recipeID - returns 200 on success", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn([{title:"testTitle",
                                                source:"testSource",
                                                username:"testUser",
                                                ingredients:"testIng1,testIng2",
                                                image:"testImage",
                                                privacy:"testPriv",
                                                comments:[{commenter:"testCommenter",comment:"testComment"}],
                                                recipeShop:true}],
                                                'findOne');
        const testData = {recipeID:"testID"}    
        const res = await request(app).get("/api/recipe/upload/" + "testID").send(testData);
        expect(res.statusCode).toBe(200);
    })

    test("GET api/recipe/upload/:recipeID - returns 404 on missing recipe", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn(null,'findOne');
        const testData = {recipeID:"testID"}    
        const res = await request(app).get("/api/recipe/upload/" + "testID").send(testData);
        expect(res.statusCode).toBe(404);
    })

    test("GET api/recipe/upload/:recipeID - returns 500 on error", async() => {
        const username = "hehe"
        mockingoose(userRecipeModel).toReturn(new Error("testError"),'findOne');
        const testData = {recipeID:"testID"}    
        const res = await request(app).get("/api/recipe/upload/" + "testID").send(testData);
        expect(res.statusCode).toBe(500);
    })
});

