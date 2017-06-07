'use strict';

const router = require('express').Router();
const config = require('config');
const socrataHotMealsAPI = config.get('resources.socrata.hot_meals');
const addLatLngFromGoogle = require('./lib/addLatLngFromGoogle/addLatLngFromGoogle');
const getHotMealLocations = require('./lib/getHotMealLocations/getHotMealLocations');
const getHotMeals = require('./middleware/getHotMeals/getHotMeals');
const getClosestHotMealEndpoint = require('./middleware/hotMealEndPoints/hotMealEndPoints');
const HotMealLocation = require('./models/HotMealLocation');
const errorHandler = require('../../lib/errorHandler/errorHandler');

/*get closest hot meal locations from API then repeat once every 24 hours if in production mode
* if in dev mode, check if there are values in the collection and call the function only if the
* collection is empty*/

if (process.env.NODE_ENV === 'development' || 'dev') {
  HotMealLocation.find({}, (error, hotMealLocations) => {
    if (error) errorHandler(error);
    if (!hotMealLocations.length)
      getHotMealLocations(socrataHotMealsAPI.seattle, addLatLngFromGoogle);
  });
} else {
  getHotMealLocations(socrataHotMealsAPI.seattle, addLatLngFromGoogle);
  setInterval(() => {
    getHotMealLocations(socrataHotMealsAPI.seattle, addLatLngFromGoogle);
  }, 86400000);
}

/**
 * @apiName get
 * @api {get} /api/hot-meal-locations request hot meal locations
 * @apiGroup hot meals
 * @apiVersion 2.0.0
 * @apiParam {Number} latitude Optional (Mandatory if longitude is included). User's latitude to query by. Submitted as a query string and formatted in signed degree format.
 * @apiParam {Number} longitude Optional (Mandatory if latitude is included). User's longitude to query by. Submitted as a query string and formatted in signed degree format.
 * @apiParam {Number} limit Optional the number of food bank locations to be returned. If not included, all hot meal locations will be returned.
 * @apiExample Example Usage:
 * https://data.pocketoutreach.org/api/hot-meal-locations/?latitude=47.673554&longitude=-122.387062&limit=3
 * @apiSuccess {Number} status The http status of the response
 * @apiSuccess {Object[]} data  Array of resource objects representing hot meal locations
 * @apiSuccess {String} data.type The type of data being returned in the resource object
 * @apiSuccess {String} data.id  The id of the hot meal location
 * @apiSuccess {Object} data.attributes The values relating to the hot meal location
 * @apiSuccess {String} data.attributes.name_of_program Name of hot meal program
 * @apiSuccess {String} data.attributes.day_time  The time hot meals are served
 * @apiSuccess {String} data.attributes.location The address of the hot meal location
 * @apiSuccess {String} data.attributes.people_served  People served by hot meal location
 * @apiSuccess {String} data.attributes.latitude Latitude of hot meal location
 * @apiSuccess {String} data.attributes.longitude Longitude of hot meal location
 * @apiSuccessExample {JSON} Example Success Response:
 * {
 *  "data": [
 *    {
 *      "type": "HotMealLocation",
 *      "id": "5928c8630c2ee52b1f40681c",
 *      "attributes": {
 *        "name_of_program": "Saint Luke's Episcopal Church",
 *        "day_time": "Fridays: 11:30 A.M. - 12:30 P.M.",
 *        "location": "5710 22nd Ave. NW  Seattle",
 *        "meal_served": "Lunch",
 *        "people_served": "OPEN TO ALL",
 *        "longitude": "-122.3844451",
 *        "latitude": "47.6704036"
 *      }
 *    },
 *    {
 *      "type": "HotMealLocation",
 *      "id": "5928c8630c2ee52b1f406875",
 *      "attributes": {
 *        "name_of_program": "Monday Feeding Program",
 *        "day_time": "Mondays: 12:30  - 1:00 P.M.",
 *        "location": "Woodland Park Pres. Church 225 N. 70th, Seattle",
 *        "meal_served": "Lunch",
 *        "people_served": "OPEN TO ALL",
 *        "longitude": "-122.355481",
 *        "latitude": "47.67938239999999"
 *      }
 *    },
 *    {
 *      "type": "HotMealLocation",
 *      "id": "5928c8630c2ee52b1f40682e",
 *      "attributes": {
 *        "name_of_program": "Phinney Neighborhood Association",
 *        "day_time": "Tuesdays: 5:00 - 6:00 P.M.",
 *        "location": "St. John's Lutheran                 5515 Phinney Ave N., Seattle",
 *        "meal_served": "Dinner",
 *        "people_served": "OPEN TO ALL",
 *        "longitude": "-122.354731",
 *        "latitude": "47.6688384"
 *      }
 *    }
 *  ],
 *  "status": 200
 * }
 * @apiError (Error 400) {String} error
 * error message
 * @apiErrorExample {JSON} Error Response:
 * {
 *   "errors": [
 *     {
 *       "error": "must provide both latitude and longitude in query",
 *       "title": "query error",
 *       "status": 400
 *     }
 *   ]
 * }
 */

router.get('/', getHotMeals, getClosestHotMealEndpoint);

module.exports = exports = router;
