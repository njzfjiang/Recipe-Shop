const request = require("supertest");
const express = require("express");
const apiRouter = require('../routes/api');

const app = new express();
app.use("/api", apiRouter);



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



    test("Register API path: localhost/api/register", async () =>{
        const res = await request(app).post("/api/register");
        expect(res.statusCode).toBe(200);
        expect(res.text).toEqual("registered");
    });


});

