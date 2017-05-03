'use strict';
/**
 * @module getFoodBank
 */

const request = require('superagent');
const config = require('config');
const getDistanceFromLatLon = require('../../../lib/getDistanceFromLatLng/getDistanceFromLatLng');
const seattleFoodBankApi = config.get('resources.socrata.food_banks.seattle');
/**
 * middleware to find closest food bank
 * @param req { Object } -  express request object
 * @param res { Object } - express response object
 * @param next { Function } - callback to call next middleware
 */
function getFoodBank(req, res, next) {
  // if the correct queries are not included, return bad request and error message
  if (!req.query.latitude || !req.query.longitude) {
    req.returnVal = {
      status: 400,
      data: { error: 'Invalid or missing query string' }
    };
    next();
  }
  // call the API and get the food banks
  request
  .get(seattleFoodBankApi.toString())
  .query({city_feature: 'Food Banks' })
  .set({'X-App-Token': process.env.SOCRATA_DATA_API_KEY, 'Accept': 'application/json'})
  .end((err, response) => {
    if (err) {
      next(err);
    }
    const foodBanks = JSON.parse(response.text);
    let closestFoodBank;
    // loop over the food banks and if the current food bank is closer assign it as the closestFoodBank
    for (const foodBank of foodBanks) {
      foodBank.distance = getDistanceFromLatLon(req.query.latitude, req.query.longitude, foodBank.latitude, foodBank.longitude);
      if (!closestFoodBank || closestFoodBank.distance > foodBank.distance) {
        closestFoodBank = foodBank;
      }
    }

    // TODO add Google location api to find driving distance

    // assign the closest food bank and status to the returnVal object
    req.returnVal = {
      status: 200,
      data: closestFoodBank
    };
    next();
  });
}

/**
 * endpoint that sets status and sends response data to client
 * @param req { Object } -  express request object
 * @param res { Object } - express response object
 */

function getFoodBankEndpoint(req, res) {
  const status = req.returnVal && req.returnVal.status ? req.returnVal.status : 400;
  const data = req.returnVal && req.returnVal.data ? req.returnVal.data : { 'error' : 'sorry we couldn\'t interpret you\'re request' };
  res.status(status);
  res.json(data);
}

module.exports = exports = {
  get: getFoodBank,
  endpoint: getFoodBankEndpoint
};
