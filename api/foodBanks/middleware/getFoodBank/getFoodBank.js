'use strict';
/**
 * @module getFoodBank
 */

const getDistanceFromLatLng = require('../../../../lib/getDistanceFromLatLng/getDistanceFromLatLng');
const FoodBank = require('../../models/FoodBank');

//noinspection JSUnusedLocalSymbols
/**
 * middleware to find closest food bank
 * @function getFoodBank
 * @param { Object } req -  express request object
 * @param { Object } res - express response object
 * @param { Function } next - callback to call next middleware
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

    FoodBank.find((err, foodBanks) => {
      if (err) next(err);

      for (const foodBank of foodBanks) {
        foodBank.distance = getDistanceFromLatLng(req.query.latitude, req.query.longitude, foodBank.latitude, foodBank.longitude);
        if (!closestFoodBank || closestFoodBank.distance > foodBank.distance) {
          closestFoodBank = foodBank;
        }
      }
      // assign the closest food bank and status to the returnVal object
      req.returnVal = {
        status: 200,
        data: closestFoodBank
      };
      next();
    });
  }
}

module.exports = exports = getFoodBank;
