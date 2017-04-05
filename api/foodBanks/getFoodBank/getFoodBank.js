'use strict';

const request = require('superagent');
// TODO add JSDOC comments
function getFoodBank(req, res, next) {

  if (!req.query.latitude || !req.query.longitude) {
    req.returnVal = {
      status: 400,
      data: 'Invalid or missing query'
    };
    next();
  }

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
    for (const foodBank of foodBanks) {
      foodBank.distance = getDistanceFromLatLon(req.query.latitude, req.query.longitude, foodBank.latitude, foodBank.longitude);
      if (!closestFoodBank || closestFoodBank.distance > foodBank.distance) {
        closestFoodBank = foodBank;
      }
    }

    // TODO add Google location api to find driving distance
    req.returnVal = {
      status: 200,
      data: closestFoodBank
    };
    next();
  });
}

module.exports = exports = getFoodBank;

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

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
