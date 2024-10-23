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
    jest.resetAllMocks();
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

  test('GET /api/login - successfully login with valid username and password', async () => {
    const params = {
      username: "existinguser",
      password: "password123",
    }
  
    User.findOne.mockResolvedValue({
      params
    });
  
    const response = await request(app).get('/api/login', {params});
  
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful!');
  });
  
  test('POST /login - fail to login because user does not exist', async () => {
    const username = 'nonexistentuser';
    const password = 'password123';
  
    User.findOne.mockResolvedValue(null);
  
    const response = await request(app)
      .get('/api/login')
      .send({
        username,
        password,
      });
  
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found.');
  });
  
  test('GET /api/login - fail to login due to incorrect password', async () => {
    const username = 'existinguser';
    const correctPassword = 'password123';
    const wrongPassword = 'wrongpassword';
  
    User.findOne.mockResolvedValue({
      username,
      password: correctPassword,
    });
  
    const response = await request(app)
      .get('/api/login')
      .send({
        username,
        password: wrongPassword,
      });
  
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Incorrect password.');
  });
  
  test('GET /api/login - fail to login due to server error', async () => {
    const username = 'existinguser';
    const password = 'password123';
  
    User.findOne.mockRejectedValue(new Error('Database error'));
  
    const response = await request(app)
      .get('/api/login')
      .send({
        username,
        password,
      });
  
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('failed Database error');
  });
  
  
});