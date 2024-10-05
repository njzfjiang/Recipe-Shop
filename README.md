# Recipe-Shop
COMP 4350-A01 Group 9
### Team Members

| Name | Username in Github  |   email |
|------|---------------------|---------|
| Meixuan Chen | njzfjiang   | chenm7@myumanitoba.ca  |
| Densson Zhu  | zhude2 | zhud2@myumanitoba.ca |
| Troy Thomas | TroyT21 | thomast9@myumanitoba.ca |
| Ifeanyi Ochiagha | Francis518 |ochiaghi@myumanitoba.ca|

### Overview

Recipe Shop is an online platform built for anyone who loves to cook or needs a hand in preparing meals. Recipe shop aims to provide convenience in the process of preparing meals and grocery shopping; and allows people of similar interests to find and share their favorite recipes.

### Vision Statement
Recipe Shop is a mobile and web based application that allows users to find recipes based on their specialized needs. The application relieves the user from the pain of having to google for recipes before each meal; and frustration when they find a recipe but did not have enough ingredients at home. With “Recipe Shop” they can simply enter the ingredients they have and have a list of recipes matching the ingredients. The main goal of Recipe Shop is to make the process of preparing meals and grocery shopping easier, and also provides a platform for recipe sharing and collecting.

### Getting Started with the project
1. Clone the Repository on your local machine
2. Add the .env file in the ```/server``` folder
3. Run ```npm install``` in the ```/web-client``` and ```/server``` folder to install dependencies.
4. Run ```npm build``` in the ```/web-client``` folder
5. Navigate to the ```/server``` folder and run ```npm start``` to start the project, it should be running on localhost:80

### Documentation
[API Documentation](https://github.com/njzfjiang/Recipe-Shop/blob/7f3a1a3495a17daec8fcd5658245c182e3fdc76b/Documentation/API%20Documentation.md)
[Architecture and Flow Diagrams](https://github.com/njzfjiang/Recipe-Shop/blob/7f3a1a3495a17daec8fcd5658245c182e3fdc76b/Documentation/Architecture%20and%20Flow%20Diagrams.md)
[Project proposal](https://github.com/njzfjiang/Recipe-Shop/blob/7f3a1a3495a17daec8fcd5658245c182e3fdc76b/Documentation/Project%20proposal.md)
[Test Plan]()

### Key features
1.  Users can create account to view and manage recipes
    
2.  The app suggest recipes based on user's input of ingredients and cooking methods
    
3.  Users can generate grocery list with their chose of recipes
    
4.  Users can search for recipes
    
5.  Registered users can upload original recipes to forum

**Non Functional**: The application can handle 20 Users sending 100 requests per minute.


### Initial Architecture
![Architecture Diagram](https://github.com/njzfjiang/Recipe-Shop/blob/dev/Documentation/images/RenewedArchitecture.JPG)

### Technology
**Front End**: React, Android Studio 

**API**: Express.js, Edamam

**Database**: MongoDB

**Server**: Python, Node.js

**Code Management**: Github
