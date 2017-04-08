define({ "api": [
  {
    "name": "getFoodBank",
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
        "content": "http://example.com/api/food-banks/closest/?latitude=47.673554&longitude=-122.387062",
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
  }
] });
