'use strict';
/**
 * @module getClosestHotMeals
 */

const querystring = require('querystring');
const request = require('superagent');
const winston = require('winston');
const config = require('config');
const googleLocationApi = config.get('resources.google.location_api');
const HotMealLocation = require('../../models/HotMealLocation');

/**
 * callback function to call the Google location API and add latitude and longitude to hotMealLocations
 * @function addLtLng
 * @param {Object} err - the error if it exists or null if no error
 * @param {Object} hotMealLocation - the MongoDB document of a hot meal location from the database
 * @returns {*} - if there's an error call winston.error on the error if no error, return the error
 */

function addLatLng(err, hotMealLocation) {
  if (err) return winston.error(err);

  const query = querystring.stringify({
    address: hotMealLocation.location,
    key: process.env.GOOGLE_API_KEY
  });

  request
  .get(`${googleLocationApi}?${query}`)
  .end((err, response) => {
    if (err) return winston.error(err);

    const hotMealObject = JSON.parse(response.text);
    if (hotMealObject.results &&
      hotMealObject.results[0] &&
      hotMealObject.results[0].geometry &&
      hotMealObject.results[0].geometry.location) {

      HotMealLocation.findByIdAndUpdate(
        hotMealLocation._id,
        {
          $set: {
            latitude: hotMealObject.results[0].geometry.location.lat,
            longitude: hotMealObject.results[0].geometry.location.lng
          }
        },
        { new: true },
        (err, hotMeal) => {
          return err ? winston.error(err) : hotMeal;
        });
    }
  });
}

module.exports = exports = addLatLng;
