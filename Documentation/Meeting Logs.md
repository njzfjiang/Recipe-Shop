# Meeting Logs COMP 4350 Group 9
## Sept.23, 2024 Meeting, 40 mins
* **Attendees**: All members
* **Notes**:
- After meeting with TA we discussed Sprint 1 work distribution, and decided to work on feature for search for keyword, user register and login.
- We also assigned issues in github, create dev tasks for each story and divide work: Mei: UI, Francis: Logic for login and Register, Troy: Client Connections, Densson: API and DB.

## Sept.27, 2024 Scrum Meeting, 15 mins
* **Attendees**: All members
* **Notes**:
Update on work progress - API connection to Edamam API has been set up; initial UI for the 3 user stories(search, login, register) has been created. Decides to continue with implementation for search feature and user login and register.
- We also discussed about building the CI pipeline, but since no tests are written, we dicide to build and test it after the search feature is complete with unit tests written for it.
- Additionally, we discussed about testing using dummy DB and DB set up.

## Sept.30, 2024 Meeting, 30 mins
* **Attendees**: Mei, Troy
* **Notes**: 
Update on work progress - Simple server for the application has been built. We set up connection from server to web-client to make sure the server is serving the correct files for the app.
- We also create documentation for getting started with the project after the meeting

## Oct.3, 2024 Meeting, 10 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress - Search feature logic is complete and acceptance tests are created and conducted for search feature.
- Discuss what to do for user login and register, Francis decides to work on setting up DB for user objects and creating the logic for user register and signup.

## Oct.4, 2024 Meeting, 20 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress - unit, integration, and acceptance tests for Search feature and front end has been created(scripts for automation was also created), simple CI pipeline has been created that included building the project, running automated unit/integration tests for web-client.
- Discussed and test about using environment Secrets in GitHub Actions for accessing API keys in build and test 


## Oct.6, 2024 Meeting 25 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress - unit, integration, and acceptance tests for server and front end have been created and included in an npm script in the workflow.
- Sign in and Register code is complete but we decided to implement the encryption for password in the next sprint since there is nothing stored in the user accounts.
- CI pipeline is updated to include server tests.
- Test plan version 1 is created, with other documentation(API, get started, flow diagrams) updated.

## Oct.7, 2024 Meeting 1 hr 30 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress - code review sign-in, register feature; merged code for search and register/login into one branch.
- Add tests for sign-in and register feature.
- Created additional documentation for Meeting logs.
- Tested the application when having the server and the client running on different machines.
- We discussed about closing complete user stories and dev tasks and any wrap up for sprint 1.

## Oct.18, 2024 Meeting 10 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress - divide work for sprint 2
- Mei: work on add to favorites feature
- Densson: work on generate grocery list feature
- Francis: work on DB integrations for new features
- Troy: work on APP front end

## Oct.23, 2024 Meeting 15 mins
* **Attendees**: Mei, Densson, Francis
* **Notes**: 
Update on work progress:
- logout feature(as an refinement for user feature in Sprint 1) and add to favorites feature is finished, including the database updates to store the favorite recipes.
- Densson and Francis continue working on CD pipeline and generating grocery list
- We decide to create tests for any newly added features and update the documentation as we develop.


## Oct.28, 2024 Meeting 20 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress:
- We discussed what needs to be finished for sprint 2 and checked on everyone's work progress.
- Generate grocery list feature was finished and we plan to added tests and documentation for the feature.
- We continue to work on the CD pipeline and testing our application running in Docker Hub.


## Nov.2, 2024 Meeting 10 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress:
- CD pipeline is ready, we tested the application in docker hub.
- Generate grocery list feature was finished and we added tests and documentation for the feature.
- We decided to finish the worksheet and finalize all documentations.

## Nov.10, 2024 Meeting 20 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress:
- We discussed the work distribution for sprint 3:
- Densson: Searching using ingredients, Troy: Uploading new Recipes, Mei: Security Scanning, Francis: Load testing
- We also talked about what to share on the technique sharing presentation

## Nov.18, 2024 Meeting 10 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress:
- We worked on adding information for the technique sharing presentation
- We also created the skeleton for the final project presentation

## Nov.21, 2024 Meeting 10 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress:
- We are finalizing slides for final presentation
- Security Scanning in CI pipeline is set up and we can see the alerts, starting on new features and fixing the security issues

## Dec.2, 2024 Meeting 25 mins
* **Attendees**: All members
* **Notes**: 
Update on work progress:
- Security problems are fixed.
- Searching using ingredients is done, working creating tests for searching ingredients. Still working on uploading new recipes and load testing
- We updated the flow diagrams and documentations.





