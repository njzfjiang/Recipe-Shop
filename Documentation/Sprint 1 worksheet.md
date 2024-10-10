# Sprint 1 Worksheet
COMP 4350 Group 9
### Test Plan
[link to test plan]([https://github.com/njzfjiang/Recipe-Shop/blob/main/Documentation/Recipe%20Shop%20Test%20Plan.pdf](https://github.com/njzfjiang/Recipe-Shop/blob/main/Documentation/Recipe%20Shop%20Test%20Plan.pdf))
### Test Coverage Reports

Since we have a bit of logic in the front end components, we wrote unit tests to cover all components in UI and created manual acceptance tests for the 3 features. Since the jest framework cannot test navigation very well we decided to test the navigation(navigate to a different page) after sign in or registeration manually.

>_Test Coverage Report for Front End_: Download folder and open /lcov_report/index.html in a web-browser.
 [link](https://umanitoba-my.sharepoint.com/:f:/g/personal/chenm7_myumanitoba_ca/EhD6uEEQ40FBgmUG6WTRJKMBq4C5-fmaEIPrYjU-mgYtoQ?e=ATAsTE)
 
 We tested all api methods and all methods in server. We decided not to test the Database in this sprint because no useful data aside from some test accounts is stored in the database and we plan to add more to the the database in sprint 2.
 
> _Test Coverage Report for Back End_: Download folder and open /lcov_report/index.html in a web-browser.
 [link](https://umanitoba-my.sharepoint.com/:f:/g/personal/chenm7_myumanitoba_ca/EhxcollPh7hPlZDuSre4Ci4BRNqvb2nEHMPGpb6mm8C79A?e=dX8HLv)

### Testing Importance
#### 3 Most Important Unit Tests:
1. [/web-client/src/pages/Search.test.js](https://github.com/njzfjiang/Recipe-Shop/blob/c1508731e987ecf21f9e00b4c57a2cd57c3d1bef/web-client/src/pages/Search.test.js#L114C3-L132C1)
- This unit test make sure the web-client displays the correct content when a search is successful.

2. [/web-client/src/pages/Recipe.test.js](https://github.com/njzfjiang/Recipe-Shop/blob/c1508731e987ecf21f9e00b4c57a2cd57c3d1bef/web-client/src/pages/Recipe.test.js#L20C4-L49C11)
- This unit test make sure a recipe page is correctly loaded with information from the API.
3. [/web-client/src/pages/Register.test.js](https://github.com/njzfjiang/Recipe-Shop/blob/dc7f648359d9823b1b19620ecfbfc93a02415002/web-client/src/pages/Register.test.js#L94C5-L120C8)
- This unit test make sure the user cannot register with an invalid username(not unique)


#### 3 Most Important Integration Tests:
1. [/server/tests/api.test.js](https://github.com/njzfjiang/Recipe-Shop/blob/c1508731e987ecf21f9e00b4c57a2cd57c3d1bef/server/tests/api.test.js#L16C4-L37C8)
- This 3 integration tests make sure the server is connected to Edamam API correctly.
2. [/server/tests/registration.test.js](https://github.com/njzfjiang/Recipe-Shop/blob/dc7f648359d9823b1b19620ecfbfc93a02415002/server/tests/registration.test.js#L33C3-L58C1)
- This integration test make sure a new user object is created in the database after registeration.
3. [/server/tests/login.test.js](https://github.com/njzfjiang/Recipe-Shop/blob/dc7f648359d9823b1b19620ecfbfc93a02415002/server/tests/login.test.js#L32C2-L50C6)
- This integration test make sure a valid request to login will return a 200 response.

#### 3 Most Important Acceptance Tests:
1.  **Acceptance Test for [user story #3](https://github.com/njzfjiang/Recipe-Shop/issues/3)**
- This acceptance test make sure the search feature is working properly by fetching a list of correct results.
- Steps:
  0.1.  Given I am the role of a guest user(not logged in).
  
  0.2.  Open the Recipe Shop Home page.

  0.3.  Click on the ¡°Search now¡± button.
  
  0.4.  Select ¡°Breakfast¡± for the meal type.

  0.5.  Enter 0 in the left input field for cooking time.

  0.6.  Enter 10 in the right input field for cooking time.

  0.7.  Enter ¡°Eggs¡± for the keyword textbox.

  0.8.  Click ¡°Search¡±

  0.9.  A list of recipes related to ¡°Eggs¡± with their respective images show up on the screen, indicating a successful search.



2. **Acceptance Test for [user story #1](https://github.com/njzfjiang/Recipe-Shop/issues/1)**
- This acceptance test make sure the user can create an account with valid username and password, and the application will indicate the user the registration is successful.
- Steps:
	0.1.  Given I am a user and I have no account registered for Recipe shop.
  
    0.2.  Open the Recipe Shop Home page.
  
    0.3.  Click on the Register now link.
  
    0.4.  Enter a unique username.
  
    0.5.  Enter a valid password.
  
    0.6.  Enter the same password again in the repeat password field.
  
    0.7.  Click "Register".
  
    0.8.  The Application redirects the user to the login page, signifying a successful register.

  

3. **Acceptance Test for [user story #2](https://github.com/njzfjiang/Recipe-Shop/issues/2)**
- This acceptance test make sure the user can sign in with valid username and password, and the application will indicate the user the login is successful.
- Steps:

    0.1.  Given I am a user with a registered account for Recipe Shop
  
    0.2.  Open the Recipe Shop homepage.
  
    0.3.  Click the Sign in button on the top left of the navbar.
  
    0.4.  Enter the correct username and password.
  
    0.5.  Click the Sign in button under the textboxes.
  
    0.6.  The application redirects the user to the home page, signifying a successful register.

### Reproducible environments
