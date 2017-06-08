'use strict';
/**
 * @module getFoodBank
 */

const getDistanceFromLatLng = require('../../../../lib/getDistanceFromLatLng/getDistanceFromLatLng');
const FoodBank = require('../../models/FoodBank');

//noinspection JSUnusedLocalSymbols
/**
 * middleware to find closest food bank
 * @function getFoodBanks
 * @param { Object } req -  express request object
 * @param { Object } res - express response object
 * @param { Function } next - callback to call next middleware
 */
function getFoodBanks(req, res, next) {

  // if the correct queries are not included, return bad request and error message
  if ((req.query && !req.query.latitude && req.query.longitude) || (req.query && req.query.latitude && !req.query.longitude)) {
    req.returnVal = {
      errors: [ {
        error: 'must provide both latitude and longitude in query',
        title: 'query error',
        status: 400
      } ]
    };
    next();
  } else {
    FoodBank.find((err, foodBanks) => {
      if (err) next(err);
      req.returnVal = {};
      const foodBanksArray = [];

      // loop over the hotMealLocations and create resource objects
      for (const foodBank of foodBanks) {
        const resourceObject = {
          id: foodBank._id,
          type: 'FoodBank',
          attributes: {
            address: foodBank.address,
            city_feature: foodBank.city_feature,
            common_name: foodBank.common_name,
            website: foodBank.website,
            longitude: foodBank.longitude,
            latitude: foodBank.latitude
          }
        };

        if (req.query && req.query.latitude && req.query.longitude && !!foodBank.latitude && !!foodBank.longitude) {
          resourceObject.attributes.distance = getDistanceFromLatLng(req.query.latitude, req.query.longitude, foodBank.latitude, foodBank.longitude);
        }
        foodBanksArray.push(resourceObject);
      }
      if (req.query && req.query.latitude && req.query.longitude) {
        foodBanksArray.sort((a, b) => {
          return a.attributes.distance - b.attributes.distance;
        });
      }

      const limit = req.query ? parseInt(req.query.limit, 10) : NaN;
      req.returnVal.data = !isNaN(limit) ? foodBanksArray.slice(0, limit) : foodBanksArray;
      req.returnVal.status = 200;
      next();
    });
  }
}

module.exports = exports = getFoodBanks;
