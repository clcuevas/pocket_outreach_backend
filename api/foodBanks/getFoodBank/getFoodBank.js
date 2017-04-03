'use strict';

const request = require('superagent');

function getFoodBank(req, res, next) {
  request
  .get('https://data.seattle.gov/resource/3c4b-gdxv.json')
  .query({city_feature: 'Food Banks' })
  .set({'X-App-Token': process.env.SEATTLE_DATA_API_KEY, 'Accept': 'application/json'})
  .end((err, response) => {
    if (err) {
      next(err);
    }
    req.foodBanks = response;
    // TODO write method to extract 3 closest food banks
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
