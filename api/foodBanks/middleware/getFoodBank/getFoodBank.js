'use strict';
/**
 * @module getFoodBank
 */

const getDistanceFromLatLng = require('../../../../lib/getDistanceFromLatLng/getDistanceFromLatLng');
const FoodBank = require('../../models/FoodBank');

/**
 * middleware to find closest food bank
 * @param req { Object } -  express request object
 * @param res { Object } - express response object
 * @param next { Function } - callback to call next middleware
 */
function getFoodBank(req, res, next) {
  let closestFoodBank;

  // if the correct queries are not included, return bad request and error message
  if (!req.query.latitude || !req.query.longitude) {
    req.returnVal = {
      status: 400,
      data: { error: 'Invalid or missing query string' }
    };
    next();
  } else {

    FoodBank.find()
    .then(foodBanks => {
      for (const foodBank of foodBanks) {
        foodBank.distance = getDistanceFromLatLng(req.query.latitude, req.query.longitude, foodBank.latitude, foodBank.longitude);
        if (!closestFoodBank || closestFoodBank.distance > foodBank.distance) {
          closestFoodBank = foodBank;
        }
      }

      return closestFoodBank;
    })
    .then(foundClosestFoodBank => {
      // TODO add Google location api to find driving distance

      // assign the closest food bank and status to the returnVal object
      req.returnVal = {
        status: 200,
        data: foundClosestFoodBank
      };
      next();
    });
  }
}

module.exports = exports = getFoodBank;
