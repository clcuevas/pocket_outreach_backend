'use strict';

const router = require('express').Router();
const config = require('config');
const socrataHotMealsAPI = config.get('resources.socrata.hot_meals');
const addLatLngFromGoogle = require('./lib/addLatLngFromGoogle/addLatLngFromGoogle');
const getHotMealLocations = require('./lib/getHotMealLocations/getHotMealLocations');
const getClosestHotMeal = require('./middleware/getClosestHotMeal/getClosestHotMeal');
const getClosestHotMealEndpoint = require('./middleware/getClosestHotMealEndpoint/getClosestHotMealEndpoint');

// get closest hot meal locations from API then repeat once every 24 hours
getHotMealLocations(socrataHotMealsAPI.seattle, addLatLngFromGoogle);
setInterval(() => {
  getHotMealLocations(socrataHotMealsAPI, addLatLngFromGoogle);
}, 86400000);

/**
 * @apiName get
 * @api {get} /api/hot-meal/closest?latitude=LATITUDE_VALUE&longitude=LONGITUDE_VALUE request closest hot meal locations
 * @apiGroup hot meals
 * @apiVersion 1.0.0
 * @apiParam {String} latitude Mandatory. User's latitude to query by. Submitted as a query string and formatted in signed degree format.
 * @apiParam {String} longitude Mandatory. User's longitude to query by. Submitted as a query string and formatted in signed degree format.
 * @apiExample Example Usage:
 * http://example.com/api/hot-meal/closest?latitude=47.673554&longitude=-122.387062
 * @apiSuccess {Object[]} hotMealLocations  Array of hot meal location objects
 * @apiSuccess {String} hotMealLocations._id  The MongoDB id of the hot meal location
 * @apiSuccess {String} hotMealLocations.name_of_program Name of hot meal program
 * @apiSuccess {String} hotMealLocations.day_time  The time hot meals are served
 * @apiSuccess {String} hotMealLocations.location The address of the hot meal location
 * @apiSuccess {String} hotMealLocations.people_served  People served by hot meal location
 * @apiSuccess {String} hotMealLocations.latitude Latitude of hot meal location
 * @apiSuccess {String} hotMealLocations.longitude Longitude of hot meal location
 * @apiSuccessExample {json} Example Success Response:
 *    [
 *      {
 *        "_id": "59152be26b9ac2febf31aea4",
 *        "name_of_program": "Saint Luke's Episcopal Church",
 *        "__v": 0,
 *        "day_time": "Fridays: 11:30 A.M. - 12:30 P.M.",
 *        "location": "5710 22nd Ave. NW  Seattle",
 *        "meal_served": "Lunch",
 *        "people_served": "OPEN TO ALL",
 *        "longitude": "-122.3844451",
 *        "latitude": "47.6704036"
 *      },
 *      {
 *        "_id": "59152be26b9ac2febf31aeb9",
 *        "name_of_program": "Monday Feeding Program",
 *        "__v": 0,
 *        "day_time": "Mondays: 12:30  - 1:00 P.M.",
 *        "location": "Woodland Park Pres. Church 225 N. 70th, Seattle",
 *        "meal_served": "Lunch",
 *        "people_served": "OPEN TO ALL",
 *        "longitude": "-122.355481",
 *        "latitude": "47.67938239999999"
 *      },
 *      {
 *        "_id": "59152be26b9ac2febf31aeb2",
 *        "name_of_program": "Phinney Neighborhood Association",
 *        "__v": 0,
 *        "day_time": "Tuesdays: 5:00 - 6:00 P.M.",
 *        "location": "St. John's Lutheran                 5515 Phinney Ave N., Seattle",
 *        "meal_served": "Dinner",
 *        "people_served": "OPEN TO ALL",
 *        "longitude": "-122.354731",
 *        "latitude": "47.6688384"
 *      }
 *    ]
 * @apiError (Error 400) {String} error
 * error message
 * @apiErrorExample {JSON} Error Response:
 *    {
 *      "error": "Invalid or missing query string"
 *    }
 */

router.get('/hot-meal/closest', getClosestHotMeal, getClosestHotMealEndpoint);

module.exports = exports = router;
