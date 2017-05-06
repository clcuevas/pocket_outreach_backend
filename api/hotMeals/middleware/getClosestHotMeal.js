'use strict';

const HotMealLocation = require('../models/HotMealLocation');
const getDistanceFromLatLng = require('../../../lib/getDistanceFromLatLng/getDistanceFromLatLng');

function getClosestHotMeal(req, res, next) {
  // if the correct queries are not included, return bad request and error message
  if (!req.query.latitude || !req.query.longitude) {
    req.returnVal = {
      status: 400,
      data: { error: 'Invalid or missing query string' }
    };
    next();
  } else {
    HotMealLocation.find({}, (error, hotMealLocations) => {
      if (error) next(error);
      req.returnVal = {};
      const hotMeals = [];
      // loop over the hotMealLocations and add distance to locations with latitude and longitude and push them into the hotMeals array
      for (const hotMeal of hotMealLocations) {
        if (!!hotMeal.latitude && !!hotMeal.longitude) {
          hotMeal.distance = getDistanceFromLatLng(req.query.latitude, req.query.longitude, hotMeal.latitude, hotMeal.longitude);
          hotMeals.push(hotMeal);
        }
      }

      hotMeals.sort((a, b) => {
        return a.distance - b.distance;
      });

      req.returnVal.data = hotMeals.slice(0, 3);
      req.returnVal.status = 200;
      next();
    });
  }
}


module.exports = exports = getClosestHotMeal;
