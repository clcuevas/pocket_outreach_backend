'use strict';
/**
 * @module getFoodBank
 */

const request = require('superagent');
/**
 * lib to find closest food bank
 * @param req { Object } -  express request object
 * @param res { Object } - express response object
 * @param next { Function } - callback to call next lib
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
  .get(`${process.env.SEATTLE_DATA_BASE_URL}/${process.env.SEATTLE_DATA_BASE_PATH}/${process.env.SEATTLE_FOOD_BANK_RESOURCE}`)
  .query({city_feature: 'Food Banks' })
  .set({'X-App-Token': process.env.SEATTLE_DATA_API_KEY, 'Accept': 'application/json'})
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

/**
 * use haversine formula to calculate
 * @param lat1 {number | string} - first latitude in signed degree format to compare
 * @param lon1 {number | string} - first longitude in signed degree format to compare
 * @param lat2 {number | string} - second latitude in signed degree format to compare
 * @param lon2 {number | string} - second longitude in signed degree format to compare
 * @returns {number} - the great-circle distance between the first latitude and longitude pair and the second latitude and longitude pair
 */

function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
  const R = 3958.7613; // Radius of the earth in miles
  const dLat = deg2rad(lat2-lat1);  // deg2rad below
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
}

/**
 * @param deg {number} - the degree value to be converted to radius
 * @returns {number} - the deg value converted to radius
 */
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

module.exports = exports = {
  get: getFoodBank,
  endpoint: getFoodBankEndpoint
};
