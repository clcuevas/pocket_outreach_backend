define({ "api": [
  {
    "type": "get",
    "url": "/food-banks/closest",
    "title": "Request closest food bank",
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
            "description": "<p>Mandatory value. Submitted as a query string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "longitude",
            "description": "<p>Mandatory value. Submitted as a query string.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "http://example.com/food-banks/closest/?latitude=47.673554&longitude=-122.387062",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "returns",
            "description": "<p>On success returns JSON object containing closest food bank</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
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
            "type": "JSON",
            "optional": false,
            "field": "returns",
            "description": "<p>With an invalid or missing query string returns JSON object with &quot;error&quot; key and description of the error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"error\": \"Invalid or missing query string\"\n}",
          "type": "JSON"
        }
      ]
    },
    "filename": "api/foodBanks/foodBanksRoutes.js",
    "groupTitle": "food_banks",
    "name": "GetFoodBanksClosest"
  }
] });
