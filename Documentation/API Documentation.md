# 	Recipe Shop API

## Description

Recipe Shop API is an API which allows users to retrieve recipes from online (connected to [Edamam API](https://developer.edamam.com/edamam-docs-recipe-api)). Recipes can be retrieved based on recipe ID, keyword, cooking time and meal type.

The API also allows the application to retrieve user data and information from MongoDB database. User objects can be created and retrieved based on username and password.

## Section 1: End points for User Account Management

## Get username availability
Check if an username exists in the database. The result is true if the username exists in the database and false if it does not exist. 

**End point** 

`GET /api/user-exist`

**Parameters**
* `username` : The username to check
	* required
  * Example value: "Admin"


**Response Example**
```json
{
	"exists": true
}
```

## Create new user object
Create new user object. The result is a successful message and the user object if the user is successfully created in the database and an error message if the username is not unique.

**End point** 

`POST /api/register`

**Parameters**
* `username` : The username of the user (unique)
	* required
  * Example value: "Admin"
* `password`: The password of the user
	* required
* `confirmPassword`: The password of the user, has to be the same as `password`
	* required


**Response Example**
```JSON
{
	"message":  "User registered successfully!", 
	"user":  "userObj"
}
```

## Get a user
Get a user based on username and password. The result is a successful message and the user object if the username and password matches and exists in the database; and an error message if the user does not exist.

**End point** 

`POST /api/login`

**Parameters**
* `username` : The username of the user (unique)
	* required
  * Example value: "Admin"
* `password`: The password of the user
	* required



**Response Example**
```json
{
	"message":  "Login successful!"
}
```
**Error Example**
```json
{ 
	"error":  "User not found."
}
```

## Section 2: End points for Recipe Management
## Upload Original Recipe

Upload an user original recipe to the database. First check if the user exists, if it exists, create a new original recipe under that user's name. If the user does not exist or the content of the recipe is not filled out appropriately, send an error message.

  

**End point**

`POST /api/recipe/upload`

  

**Parameters**
*  `title` : The title of the original recipe
*  `username` : The username of the user who uploaded the recipe
*   `ingredients` : The ingredients of the original recipe
*   `instructions` : The instructions of the original recipe
*   `source` : The author or source of the recipe
*  `privacy` : The type of recipe uploaded (private or public)
*  `image` : The image of the recipe, in base64


**Response Example**

```json
{
 "message":"Recipe uploaded successfully!"
}

```

**Error Example**

```json

{

"error": "Uploader username does not exist."

}

```
## Get a list of uploaded recipes

Get a list of uploaded recipes by the specific user. Return a list of recipes uploaded, return error if there is no recipes found.
  

**End point**

`GET /all-uploads/{username}`

  

**Parameters**
*  `username` : The username of the user who uploaded the recipe


**Response Example**

```json
{
 "recipes":[
 {
 "title":"tomato soup"
 "ingredients":"1 tomato, 3 cup of water"
 }]
}

```

**Error Example**

```json

{

"error": "No uploaded Recipes found."

}

```

## Delete an uploaded recipe

Delete an uploaded recipe by a specific user by its recipeID. If no recipe given the recipeID is found, return an error.
  

**End point**

`DELETE /uploads/{recipeID}`

  

**Parameters**
*  `username` : The username of the user who uploaded the recipe
*  `recipeID` : The recipeID for the recipe to be deleted.


**Response Example**

```json
{
 "message":"Recipe deleted from uploads."
}

```

**Error Example**

```json
{

"error": "No matching recipe found in uploads."

}

```
## Check if recipe is uploaded by User

Check if the specific recipe is uploaded by the user requested. Return true if it is uploaded by this user, return false if it is not. 
  

**End point**

`GET /is-upload/{recipeID}`

  

**Parameters**
*  `username` : The username of the user who uploaded the recipe
*  `recipeID` : The recipeID for the recipe.


**Response Example**

```json
{
 "uploaded":"true"
}

```

## Get a specific uploaded recipe

Get an uploaded recipe by recipeID, if it exists, return the recipe, if it does not exist, return an error.
  

**End point**

`GET /recipe/upload/{recipeID}`

  

**Parameters**
*  `recipeID` : The recipeID for the recipe.


**Response Example**

```json
{
 "title":"beef noodle"
 "ingredients":"steak, noodles, water"
}

```

**Error Example**

```json
{

"error": "Recipe not found!"

}

```


## Create new favorite recipe object
Create a new favorite recipe in the database. First check if an favorite recipe exists in the database for the given user. If it exists, return an error. If it does not exist, create a new favorite recipe in the database. The result is a message and the recipe object if the recipe is stored.

**End point** 

`POST /api/favorites/{recipeID}`

**Parameters**
* `username` : The username of the user who saved the recipe
	* required
  * Example value: "Admin"
* `recipeID` : specific recipeID assigned by Edamam API
	* required
* `title` : label of the recipe
	* required


**Response Example**
```json
{
	"message": "Recipe stored successfully!"
	"recipe": "recipeObj"
}
```
**Error Example**
```json
{
	"error": "Recipe already saved."
}
```

## Delete a favorite recipe object
Delete a new favorite recipe in the database. First check if an favorite recipe exists in the database for the given user. If it exists, delete the recipe. If it does not exist, return an error. The result is a message or error indicating if the recipe has been deleted or not.

**End point** 

`DELETE /api/favorites/{recipeID}`

**Parameters**
* `username` : The username of the user who saved the recipe
	* required
  * Example value: "Admin"
* `recipeID` : specific recipeID assigned by Edamam API
	* required


**Response Example**
```json
{
	"message": "Recipe deleted from favorites."
	"recipeID": "12345678"
}
```
**Error Example**
```json
{
	"error": "No matching recipe found in favorites."
}
```

## Check if a favorite recipe exists
Check if an favorite recipe exists in the database for a given user. Returns true if it exists, returns false if it does not exist.

**End point** 

`GET /api/is-favorite/{recipeID}`

**Parameters**
* `username` : The username of the user who saved the recipe
	* required
  * Example value: "Admin"
* `recipeID` : specific recipeID assigned by Edamam API
	* required


**Response Example**
```json
{
	"saved": true
}
```

## Get all favorite recipes of a given user
Get all favorite recipes in the database for a given user. The result is a list of favorite recipe objects, each containing an recipeID, username of the user and title of the recipe. 

**End point** 

`GET /api/all-favorites/{username}`

**Parameters**
* `username` : The username of the user who saved the recipe
	* required
  * Example value: "Admin"



**Response Example**
```json
[{
	"recipeID": "1234567"
	"username": "john123"
	"title": "tomato soup"
},
{
	"recipeID": "2398502"
	"username": "john123"
	"title": "pink milk tea"
},
]
```


## Delete all favorite recipes of a given user
Find and delete all favorite recipes in the database for a given user, returns error if no favorite recipes are found for this user.

**End point** 

`DELETE /api/all-favorites/{username}`

**Parameters**
* `username` : The username of the user who saved the recipe
	* required
  * Example value: "Admin"



**Response Example**
```json
{
	"message": "deleted all recipes from favorites"
}
```

## Get specific information from user's favorite recipes

Get specific information of each recipe in a user's favorite recipes list. First check if any favorite recipes exists in the database for the given user. If no favorite recipes are found, return an error. The returned result is an array of recipes with their detailed information.

  

**End point**
`GET /api/generate-list/{username}`

  

**Parameters**

*  `username` : The username of the user who saved the recipe

* required

* Example value: "Admin"


  

**Response Example**

```json
{
 "recipes": [
  "3f40351ef85b4323b4c9bf654355cafe",
  "5b7d909dc82c048b361bc2909d31d577"
 ]
}
```

**Error Example**

```json

{

"error": "No favorite Recipes found."

}

```

## Recipe Management End points linked to Edamam API

## Get a specific recipe

Retrieve a specific recipe and relevant nutritional facts based on its recipe ID assigned by Edamam API. The result is represented in JSON. 

Endpoint: `GET /recipe/{recipeID}`

Parameters:
* `recipeID`: specific recipeID assigned by Edamam API
	* required

Resources:
```json
{
  "recipe": {
    "uri": "string",
    "label": "string",
    "image": "string",
    "images": {
      "THUMBNAIL": {
        "url": "string",
        "width": 0,
        "height": 0
      },
      "SMALL": {
        "url": "string",
        "width": 0,
        "height": 0
      },
      "REGULAR": {
        "url": "string",
        "width": 0,
        "height": 0
      },
      "LARGE": {
        "url": "string",
        "width": 0,
        "height": 0
      }
    },
    "source": "string",
    "url": "string",
    "shareAs": "string",
    "yield": 0,
    "dietLabels": [
      "string"
    ],
    "healthLabels": [
      "string"
    ],
    "cautions": [
      "string"
    ],
    "ingredientLines": [
      "string"
    ],
    "ingredients": [
      {
        "text": "string",
        "quantity": 0,
        "measure": "string",
        "food": "string",
        "weight": 0,
        "foodId": "string"
      }
    ],
    "calories": 0,
    "glycemicIndex": 0,
    "inflammatoryIndex": 0,
    "totalCO2Emissions": 0,
    "co2EmissionsClass": "A+",
    "totalWeight": 0,
    "cuisineType": [
      "string"
    ],
    "mealType": [
      "string"
    ],
    "dishType": [
      "string"
    ],
    "instructions": [
      "string"
    ],
    "tags": [
      "string"
    ],
    "externalId": "string",
    "totalNutrients": {
      "additionalProp1": {
        "label": "string",
        "quantity": 0,
        "unit": "string"
      },
      "additionalProp2": {
        "label": "string",
        "quantity": 0,
        "unit": "string"
      },
      "additionalProp3": {
        "label": "string",
        "quantity": 0,
        "unit": "string"
      }
    },
    "totalDaily": {
      "additionalProp1": {
        "label": "string",
        "quantity": 0,
        "unit": "string"
      },
      "additionalProp2": {
        "label": "string",
        "quantity": 0,
        "unit": "string"
      },
      "additionalProp3": {
        "label": "string",
        "quantity": 0,
        "unit": "string"
      }
    },
    "digest": [
      {
        "label": "string",
        "tag": "string",
        "schemaOrgTag": "string",
        "total": 0,
        "hasRDI": true,
        "daily": 0,
        "unit": "string",
        "sub": "string"
      }
    ]
  },
  "_links": {
    "self": {
      "href": "string",
      "title": "string"
    },
    "next": {
      "href": "string",
      "title": "string"
    }
  }
}

```

## Get a list of Recipes based on keyword
Get a list of recipes based on user specified keyword. The result is a JSON array of recipes. Each element contain the recipe and its URI, and all relevent information. The array have a default length of 20.

**End point** 

`GET /recipe/search`

**Parameters**
* `keyword` : The query text for the recipes
	* required
  * Example value: "Eggs"
* `meal type`: The type of meal a recipe belongs to,
	* optional
	* Avaliable Values: Breakfast, Dinner, Lunch, Snack, Teatime
* `time`: preparation time of the recipe
	* optional

**Response Example**
```json
{
  "from": 0,
  "to": 0,
  "count": 0,
  "_links": {
    "self": {
      "href": "string",
      "title": "string"
    },
    "next": {
      "href": "string",
      "title": "string"
    }
  },
  "hits": [
    {
      "recipe": {
        "uri": "string",
        "label": "string",
        "image": "string",
        "images": {
          "THUMBNAIL": {
            "url": "string",
            "width": 0,
            "height": 0
          },
          "SMALL": {
            "url": "string",
            "width": 0,
            "height": 0
          },
          "REGULAR": {
            "url": "string",
            "width": 0,
            "height": 0
          },
          "LARGE": {
            "url": "string",
            "width": 0,
            "height": 0
          }
        },
        "source": "string",
        "url": "string",
        "shareAs": "string",
        "yield": 0,
        "dietLabels": [
          "string"
        ],
        "healthLabels": [
          "string"
        ],
        "cautions": [
          "string"
        ],
        "ingredientLines": [
          "string"
        ],
        "ingredients": [
          {
            "text": "string",
            "quantity": 0,
            "measure": "string",
            "food": "string",
            "weight": 0,
            "foodId": "string"
          }
        ],
        "calories": 0,
        "glycemicIndex": 0,
        "inflammatoryIndex": 0,
        "totalCO2Emissions": 0,
        "co2EmissionsClass": "A+",
        "totalWeight": 0,
        "cuisineType": [
          "string"
        ],
        "mealType": [
          "string"
        ],
        "dishType": [
          "string"
        ],
        "instructions": [
          "string"
        ],
        "tags": [
          "string"
        ],
        "externalId": "string",
        "totalNutrients": {
          "additionalProp1": {
            "label": "string",
            "quantity": 0,
            "unit": "string"
          },
          "additionalProp2": {
            "label": "string",
            "quantity": 0,
            "unit": "string"
          },
          "additionalProp3": {
            "label": "string",
            "quantity": 0,
            "unit": "string"
          }
        },
        "totalDaily": {
          "additionalProp1": {
            "label": "string",
            "quantity": 0,
            "unit": "string"
          },
          "additionalProp2": {
            "label": "string",
            "quantity": 0,
            "unit": "string"
          },
          "additionalProp3": {
            "label": "string",
            "quantity": 0,
            "unit": "string"
          }
        },
        "digest": [
          {
            "label": "string",
            "tag": "string",
            "schemaOrgTag": "string",
            "total": 0,
            "hasRDI": true,
            "daily": 0,
            "unit": "string",
            "sub": "string"
          }
        ]
      },
      "_links": {
        "self": {
          "href": "string",
          "title": "string"
        },
        "next": {
          "href": "string",
          "title": "string"
        }
      }
    }
  ]
}

```
