
const request = require("supertest");
const User = require('../models/User');     
const mongoose = require('mongoose');
const { app, server } = require('../server'); 


jest.mock('../models/User', () => ({
  findOne: jest.fn(), 
  create: jest.fn(),   
}));

describe('User registration API tests', () => {

  afterEach(() => {
    jest.clearAllMocks();  
  });

  afterAll(async () => {
  if (server) {
    await new Promise((resolve) => {
      server.close(resolve); 
    });
  }

  
  await mongoose.connection.close(); 
  console.log("Test suite cleanup complete.");
  });

  test('POST /api/register - successfully register a new user with valid input', async () => {
    const username = 'newuser';
    const password = 'password123';  

    
    User.findOne.mockResolvedValue(null);  
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


  test('POST /api/register - fail to register a new user because the username is already taken', async () => {
    const username = 'existinguser';
    const password = 'password123';

    User.findOne.mockResolvedValue({
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

    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe('Username already taken');
  });


  test('POST /api/register - fail to register a new user due to server error', async () => {
    const username = 'newuser';
    const password = 'password123';

    User.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/api/register')
      .send({
        username,
        password,
        confirmPassword: password,
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('User Registration failed');
  });

  
});