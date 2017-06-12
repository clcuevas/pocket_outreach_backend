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
 * @api {get} /api/food-banks get food banks
 * @apiGroup food banks
 * @apiVersion 2.0.0
 * @apiParam {Number} latitude Optional (Mandatory if longitude is included). User's latitude to query by. Submitted as a query string and formatted in signed degree format.
 * @apiParam {Number} longitude Optional (Mandatory if latitude is included). User's longitude to query by. Submitted as a query string and formatted in signed degree format.
 * @apiParam {Number} limit Optional the number of food bank locations to be returned. If not included, all hot meal locations will be returned.
 * @apiExample Example Usage:
 * https://data.pocketoutreach.org/api/food-banks?latitude=47.673554&longitude=-122.387062&limit=3
 * @apiSuccess {Number} status The http status of the response
 * @apiSuccess {Object[]} data  Array of resource objects representing food banks
 * @apiSuccess {String} data.type The type of data being returned in the resource object
 * @apiSuccess {String} data.id  The id of the hot meal location
 * @apiSuccess {Object} data.attributes The values relating to the hot meal location
 * @apiSuccess {String} data.attributes.common_name Name of food bank
 * @apiSuccess {String} data.attributes.address The address of the hot meal location
 * @apiSuccess {String} data.attributes.website  The website of the food bank
 * @apiSuccess {String} data.attributes.latitude Latitude of hot meal location
 * @apiSuccess {String} data.attributes.longitude Longitude of hot meal location
 * @apiSuccessExample {JSON} Example Success Response:
 * {
 *  "data": [
 *    {
 *      "id": "5928c8620c2ee52b1f4067f1",
 *      "type": "FoodBank",
 *      "attributes": {
 *        "address": "9747 Greenwood Ave N",
 *        "common_name": "Volunteers Of America-Greenwood",
 *        "website": "http://www.voaww.org/voa3f.cfm?SectionGroupsID=11&SectionListsID=11&PageID=234",
 *        "longitude": "-122.355521",
 *        "latitude": "47.699736",
 *        "distance": 0
 *      }
 *    },
 *    {
 *      "id": "5928c8630c2ee52b1f4067fc",
 *      "type": "FoodBank",
 *      "attributes": {
 *        "address": "7500 Greenwood Ave N",
 *        "common_name": "Phinney Ridge Food Bank",
 *        "website": "http://www.prlc.org/foodbank.htm",
 *        "longitude": "-122.355178",
 *        "latitude": "47.683311",
 *        "distance": 1.1349715197312662
 *      }
 *    },
 *    {
 *      "id": "5928c8620c2ee52b1f4067d8",
 *      "type": "FoodBank",
 *      "attributes": {
 *        "address": "7005 24th Ave NW",
 *        "common_name": "Ballard Food Bank",
 *        "website": "http://www.ballardfoodbank.org",
 *        "longitude": "-122.387661",
 *        "latitude": "47.679582",
 *        "distance": 2.042938429556082
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

router.get('/', getFoodBanks, getFoodBankEndpoint);

module.exports = exports = router;
