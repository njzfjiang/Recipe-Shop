# 	Recipe Shop API

## Description

Recipe Shop API is an API which allows users to retrieve recipes from online (connected to [Edamam API](https://developer.edamam.com/edamam-docs-recipe-api)). Recipes can be retrieved based on recipe ID, keyword, cooking time and meal type.

The API also allows the application to retrieve user data and information from MongoDB database. User objects can be created and retrieved based on username and password.

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

`GET /api/login`

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