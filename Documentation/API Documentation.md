# 	Recipe Shop API

## Description

Recipe Shop API is an API which allows users to retrieve recipes from online (connected to [Edamam API](https://developer.edamam.com/edamam-docs-recipe-api)). Recipes can be retrieved based on recipe ID, keyword, cooking time and meal type.

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