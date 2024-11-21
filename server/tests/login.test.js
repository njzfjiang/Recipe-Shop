const request = require("supertest");
const User = require('../models/User');     
const mongoose = require('mongoose');
const { app, server } = require('../server'); 
const { hashPassword, checkPasswordMatch } = require('../util/encryption.js');

jest.mock('../models/User', () => ({
  findOne: jest.fn(), 
  create: jest.fn(),   
}));

jest.mock('../util/encryption.js', () => ({
  hashPassword: jest.fn(),
  checkPasswordMatch: jest.fn(),
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

  test('POST /api/login - successfully login with valid username and password', async () => {
    const username = "existinguser";
    const password = "password123";
    const hashedPassword = await hashPassword(password); // Simulate hashing
  
    User.findOne.mockResolvedValue({
      username,
      password: hashedPassword,
    });
  
    checkPasswordMatch.mockResolvedValue(true); // Simulate successful password match
  
    const response = await request(app)
      .post('/api/login') 
      .send({ username, password }); 
  
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful!');
  });
  
  
  test('POST /login - fail to login because user does not exist', async () => {
    const username = 'nonexistentuser';
    const password = 'password123';
  
    User.findOne.mockResolvedValue(null);
  
    const response = await request(app)
      .post('/api/login')
      .send({
        username,
        password,
      });
  
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found.');
  });
  
  test('POST /api/login - fail to login due to incorrect password', async () => {
    const username = 'existinguser';
    const correctPassword = 'password123';
    const wrongPassword = 'wrongpassword';
    const hashedPassword = await hashPassword(correctPassword);

    User.findOne.mockResolvedValue({
      username,
      password: hashedPassword,
    });

    checkPasswordMatch.mockResolvedValue(false); // Simulate password comparison failure

    const response = await request(app)
      .post('/api/login')
      .send({ username, password: wrongPassword });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Incorrect username or password');
  });


  test('POST /api/login - fail to login due to server error', async () => {
    const username = 'existinguser';
    const password = 'password123';

    User.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/api/login')
      .send({ username, password });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('failed Database error');
  });
});
  
  