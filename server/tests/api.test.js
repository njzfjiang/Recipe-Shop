const request = require("supertest");
const express = require("express");
const apiRouter = require('../routes/api');
const User = require("../models/User");
const mongoose = require("mongoose");

const app = new express();
app.use("/api", apiRouter);

jest.mock("../models/User", () =>({
    findOne: jest.fn(),
    create: jest.fn(),
}));



describe("API route tests", () =>{
    //afterEach(() =>{
        //jest.clearAllMocks();
    //});

    afterAll(() => {
        jest.clearAllMocks();
    });

    /*afterAll(async () => {
        if (server){
            await new Promise((resolve) => {
                server.close(resolve);
            });
        }

        await mongoose.connection.close();
        console.log("Test suite cleanup complete.");
    });*/

    test("GET Default API path: localhost/api/", async () => {
        const res = await request(app).get("/api");
        expect(res.statusCode).toBe(200);
        expect(res.text).toEqual("this url path is for api 'localhost/api/*'");
    });


    test("GET Recipe Search: localhost/api/recipe/search", async () =>{
        params =  {
            keyword: "eggs",
            mealType: "Breakfast",
            time: "5-60"
        };
        const res = await request(app).get("/api/recipe/search", {params});
        expect(res.statusCode).toBe(200);
    });


    test("GET Recipe Info: localhost/api/recipe/:recipeID", async () =>{
        const recipeID = "7a844b79a5df3f11e822cc229bfb3981";
        const res = await request(app).get("/api/recipe/" + recipeID);
        expect(res.statusCode).toBe(200);
    });

    test("Error when searching for non-existent recipe", async () =>{
        const recipeID = "122333";
        const res = await request(app).get("/api/recipe/" + recipeID);
        expect(res.statusCode).toBe(404);
    });



    test("Register new user", async () =>{
        const username = 'newuser';
        const password = 'password123';  

        //User.findOne.mockResolvedValue(null);  
        User.create.mockResolvedValue({
            username,
            password,  
        });  

        const response = await request(app)
        .post('/api/register')
        .send({
            username,
            password,
            confirmPassword: password,  
        });

        expect(response.statusCode).toBe(201);  
        expect(response.body.message).toBe('User registered successfully!');
        expect(response.body.user).toHaveProperty('username', username);
        expect(response.body.user.password).toBe(password);
    });


    test("Register existing user", async () =>{
        const username = 'newuser';
        const password = 'password123';  

        User.findOne.mockResolvedValue({username, password});  

        const response = await request(app)
        .post('/api/register')
        .send({
            username,
            password,
            confirmPassword: password,  
        });

        expect(response.statusCode).toBe(409);  
        expect(response.body.error).toBe('Username already taken');
    });

    test("Login existing user", async () =>{
        const username = 'newuser';
        const password = 'password123';  

        User.findOne.mockResolvedValue({username, password});  

        const response = await request(app)
        .post('/api/login')
        .send({
            username,
            password
        });

        //console.log(response.body.message);
        expect(response.statusCode).toBe(200);  
        expect(response.body.message).toBe('Login successful!');
    });


    test("Login invalid password", async () =>{
        const username = 'newuser';
        const password = 'password321';  

        //User.findOne.mockResolvedValue({username, password});  

        const response = await request(app)
        .post('/api/login')
        .send({
            username,
            password
        });

        //console.log(response.body.message);
        expect(response.statusCode).toBe(401);  
        expect(response.body.error).toBe('Incorrect password.');
    });


    test("Login invalid user", async () =>{
        const username = 'nouser';
        const password = 'APassword';  

        User.findOne.mockResolvedValue(null);  

        const response = await request(app)
        .post('/api/login')
        .send({
            username,
            password
        });

        //console.log(response.body.message);
        expect(response.statusCode).toBe(404);  
        expect(response.body.error).toBe('User not found.');
    });


    test("User-Exist True", async () =>{
        const username = 'newuser';

        User.findOne.mockResolvedValue({username});  

        const response = await request(app)
        .get('/api/user-exist')
        .send({
            username
        });

        //console.log(response.body.message);
        expect(response.statusCode).toBe(200);  
        expect(response.body.exists).toBe(true);
    });


});

