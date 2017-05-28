define({ "api": [
  {
    "name": "get",
    "type": "get",
    "url": "/api/food-banks/closest/?latitude=LATITUDE_VALUE&longitude=LONGITUDE_VALUE",
    "title": "request closest food bank",
    "group": "food_banks",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "latitude",
            "description": "<p>Mandatory. User's latitude to query by. Submitted as a query string and formatted in signed degree format.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "longitude",
            "description": "<p>Mandatory. User's longitude to query by. Submitted as a query string and formatted in signed degree format.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "https://data.pocketoutreach.org/api/food-banks/closest/?latitude=47.673554&longitude=-122.387062",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>food bank's address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "city_feature",
            "description": "<p>the category title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "common_name",
            "description": "<p>the name of the food bank</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "latitude",
            "description": "<p>food bank's latitude</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "longitude",
            "description": "<p>food bank's longitude</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "location",
            "description": "<p>object containing location data for the food bank</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location.type",
            "description": "<p>the location type, Point, Polygon, or Line</p>"
          },
          {
            "group": "Success 200",
            "type": "Number[]",
            "optional": false,
            "field": "location.coordinates",
            "description": "<p>array containing point coordinates</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "website",
            "description": "<p>website address for the food bank</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "distance",
            "description": "<p>the distance in miles (in a straight line) from the location submitted to the food bank</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Success Response:",
          "content": " {\n  \"address\": \"7005 24th Ave NW\",\n  \"city_feature\": \"Food Banks\",\n  \"common_name\": \"Ballard Food Bank\",\n  \"latitude\": \"47.679582\",\n  \"location\": {\n    \"type\": \"Point\",\n    \"coordinates\": [\n      -122.387661,\n      47.679582\n    ]\n  },\n  \"longitude\": \"-122.387661\",\n  \"website\": \"http://www.ballardfoodbank.org\",\n  \"distance\": 0.4174263197848783\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>error message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response:",
          "content": "{\n  \"error\": \"Invalid or missing query string\"\n}",
          "type": "JSON"
        }
      ]
    },
    "filename": "api/foodBanks/foodBanksRoutes.js",
    "groupTitle": "food_banks"
  },
  {
    "name": "get",
    "type": "get",
    "url": "/api/hot-meal/closest?latitude=LATITUDE_VALUE&longitude=LONGITUDE_VALUE",
    "title": "request closest hot meal locations",
    "group": "hot_meals",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "latitude",
            "description": "<p>Mandatory. User's latitude to query by. Submitted as a query string and formatted in signed degree format.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "longitude",
            "description": "<p>Mandatory. User's longitude to query by. Submitted as a query string and formatted in signed degree format.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "https://data.pocketoutreach.org/api/hot-meal/closest?latitude=47.673554&longitude=-122.387062",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "hotMealLocations",
            "description": "<p>Array of hot meal location objects</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hotMealLocations._id",
            "description": "<p>The MongoDB id of the hot meal location</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hotMealLocations.name_of_program",
            "description": "<p>Name of hot meal program</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hotMealLocations.day_time",
            "description": "<p>The time hot meals are served</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hotMealLocations.location",
            "description": "<p>The address of the hot meal location</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hotMealLocations.people_served",
            "description": "<p>People served by hot meal location</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hotMealLocations.latitude",
            "description": "<p>Latitude of hot meal location</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "hotMealLocations.longitude",
            "description": "<p>Longitude of hot meal location</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example Success Response:",
          "content": "[\n  {\n    \"_id\": \"59152be26b9ac2febf31aea4\",\n    \"name_of_program\": \"Saint Luke's Episcopal Church\",\n    \"__v\": 0,\n    \"day_time\": \"Fridays: 11:30 A.M. - 12:30 P.M.\",\n    \"location\": \"5710 22nd Ave. NW  Seattle\",\n    \"meal_served\": \"Lunch\",\n    \"people_served\": \"OPEN TO ALL\",\n    \"longitude\": \"-122.3844451\",\n    \"latitude\": \"47.6704036\"\n  },\n  {\n    \"_id\": \"59152be26b9ac2febf31aeb9\",\n    \"name_of_program\": \"Monday Feeding Program\",\n    \"__v\": 0,\n    \"day_time\": \"Mondays: 12:30  - 1:00 P.M.\",\n    \"location\": \"Woodland Park Pres. Church 225 N. 70th, Seattle\",\n    \"meal_served\": \"Lunch\",\n    \"people_served\": \"OPEN TO ALL\",\n    \"longitude\": \"-122.355481\",\n    \"latitude\": \"47.67938239999999\"\n  },\n  {\n    \"_id\": \"59152be26b9ac2febf31aeb2\",\n    \"name_of_program\": \"Phinney Neighborhood Association\",\n    \"__v\": 0,\n    \"day_time\": \"Tuesdays: 5:00 - 6:00 P.M.\",\n    \"location\": \"St. John's Lutheran                 5515 Phinney Ave N., Seattle\",\n    \"meal_served\": \"Dinner\",\n    \"people_served\": \"OPEN TO ALL\",\n    \"longitude\": \"-122.354731\",\n    \"latitude\": \"47.6688384\"\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>error message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error Response:",
          "content": "{\n  \"error\": \"Invalid or missing query string\"\n}",
          "type": "JSON"
        }
      ]
    },
    "filename": "api/hotMeals/hotMealRoutes.js",
    "groupTitle": "hot_meals"
  }
] });
