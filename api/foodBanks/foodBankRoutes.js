'use strict';

const express = require('express');
const router = express.Router();
const config = require('config');
const socrataFoodBanksAPI = config.get('resources.socrata.food_banks');

const errorHandler = require('../../lib/errorHandler/errorHandler');
const getFoodBanks = require('./middleware/getFoodBanks/getFoodBanks');
const getFoodBankEndpoint = require('./middleware/getFoodBanksEndpoint/getFoodBanksEndpoint');
const getSeattleFoodBanks = require('./lib/getSeattleFoodBanks/getSeattleFoodBanks');
const getCentralEastNCFoodBank = require('./lib/getCentralEastNCFoodBanks/getCentralEastNCFoodBanks');
const FoodBank = require('./models/FoodBank');

/*get closest food banks locations from API then repeat once every 24 hours if in production mode
 * if in dev mode, check if there are values in the collection and call the function only if the
 * collection is empty*/

if (process.env.NODE_ENV === 'development' || 'dev') {
  FoodBank.find({}, (error, foodBanks) => {
    if (error) errorHandler(error);
    if (!foodBanks.length) {
      getSeattleFoodBanks(socrataFoodBanksAPI.seattle, errorHandler);
      getCentralEastNCFoodBank(socrataFoodBanksAPI.central_east_north_carolina, errorHandler);
    }
  });
} else {
  getSeattleFoodBanks(socrataFoodBanksAPI.seattle, errorHandler);
  getCentralEastNCFoodBank(socrataFoodBanksAPI.central_east_north_carolina, errorHandler);
  setInterval(() => {
    getSeattleFoodBanks(socrataFoodBanksAPI.seattle, errorHandler);
    getCentralEastNCFoodBank(socrataFoodBanksAPI.central_east_north_carolina, errorHandler);
  }, 86400000);
}

/**
 * @apiName get
 * @api {get} /api/food-banks/closest/?latitude=LATITUDE_VALUE&longitude=LONGITUDE_VALUE request closest food bank
 * @apiGroup food banks
 * @apiVersion 1.0.0
 * @apiParam {String} latitude Mandatory. User's latitude to query by. Submitted as a query string and formatted in signed degree format.
 * @apiParam {String} longitude Mandatory. User's longitude to query by. Submitted as a query string and formatted in signed degree format.
 * @apiExample Example Usage:
 * https://data.pocketoutreach.org/api/food-banks/closest/?latitude=47.673554&longitude=-122.387062
 * @apiSuccess {String} address food bank's address
 * @apiSuccess {String} city_feature the category title
 * @apiSuccess {String} common_name the name of the food bank
 * @apiSuccess {String} latitude food bank's latitude
 * @apiSuccess {String} longitude food bank's longitude
 * @apiSuccess {Object} location object containing location data for the food bank
 * @apiSuccess {String} location.type the location type, Point, Polygon, or Line
 * @apiSuccess {Number[]} location.coordinates array containing point coordinates
 * @apiSuccess {String} website website address for the food bank
 * @apiSuccess {Number} distance the distance in miles (in a straight line) from the location submitted to the food bank
 * @apiSuccessExample {json} Example Success Response:
 *    {
 *     "address": "7005 24th Ave NW",
 *     "city_feature": "Food Banks",
 *     "common_name": "Ballard Food Bank",
 *     "latitude": "47.679582",
 *     "location": {
 *       "type": "Point",
 *       "coordinates": [
 *         -122.387661,
 *         47.679582
 *       ]
 *     },
 *     "longitude": "-122.387661",
 *     "website": "http://www.ballardfoodbank.org",
 *     "distance": 0.4174263197848783
 *   }
 * @apiError (Error 400) {String} error
 * error message
 * @apiErrorExample {JSON} Error Response:
 *    {
 *      "error": "Invalid or missing query string"
 *    }
 */

router.get('/', getFoodBanks, getFoodBankEndpoint);

module.exports = exports = router;