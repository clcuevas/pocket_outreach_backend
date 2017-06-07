'use strict';
/**
 * @module getHotMeals
 */

const HotMealLocation = require('../../models/HotMealLocation');
const getDistanceFromLatLng = require('../../../../lib/getDistanceFromLatLng/getDistanceFromLatLng');

//noinspection JSUnusedLocalSymbols
/**
 * Middleware to retrieve the closest hot meal location from the database
 * @function getHotMeals
 * @param {Object} req - the express request object
 * @param {Object} res - the express response object
 * @param { Function } next - callback to call next middleware
 */
function getHotMeals(req, res, next) {
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
    HotMealLocation.find((error, hotMealLocations) => {
      if (error) next(error);
      req.returnVal = {};
      const hotMeals = [];
      // loop over the hotMealLocations and create resource objects
      for (const hotMeal of hotMealLocations) {
        const resourceObject = {
          id: hotMeal._id,
          type: 'HotMealLocation',
          attributes: {
            name_of_program: hotMeal.name_of_program ? hotMeal.name_of_program : '',
            day_time: hotMeal.day_time ? hotMeal.day_time : '',
            location: hotMeal.location ? hotMeal.location : '',
            meal_served: hotMeal.meal_served ? hotMeal.meal_served : '',
            people_served: hotMeal.people_served ? hotMeal.people_served : '',
            longitude: hotMeal.longitude ? hotMeal.longitude : '',
            latitude: hotMeal.latitude ? hotMeal.latitude : ''
          }
        };
        
        if (req.query && req.query.latitude && req.query.longitude && !!hotMeal.latitude && !!hotMeal.longitude) {
          resourceObject.attributes.distance = getDistanceFromLatLng(req.query.latitude, req.query.longitude, hotMeal.latitude, hotMeal.longitude);
        }
        hotMeals.push(resourceObject);
      }
      if (req.query && req.query.latitude && req.query.longitude) {
        hotMeals.sort((a, b) => {
          return a.attributes.distance - b.attributes.distance;
        });
      }

      const limit = req.query ? parseInt(req.query.limit, 10) : NaN;
      req.returnVal.data = !isNaN(limit) ? hotMeals.slice(0, limit) : hotMeals;
      req.returnVal.status = 200;
      next();
    });
  }
}

module.exports = exports = getHotMeals;
