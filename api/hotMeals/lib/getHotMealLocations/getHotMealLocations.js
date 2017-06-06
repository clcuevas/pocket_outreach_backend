'use strict';
/**
 * @module getHotMeals
 */

const request = require('superagent');
const HotMealLocation = require('../../models/HotMealLocation');

/**
 * @function getHotMealLocations
 * @param {String} url - the url of the Socrata API resource for hot meal locations
 * @param {Function} callback - the callback to call on the hot meal location or the error if one is returned
 */

function getHotMealLocations(url, callback) {
  // call the API and get the food banks
  request
    .get(url)
    .set({ 'X-App-Token': process.env.SOCRATA_DATA_API_KEY, 'Accept': 'application/json' })
    .end((err, response) => {
      if (err) return callback(err);

      const hotMealLocations = JSON.parse(response.text);

      for (const hotMealLocation of hotMealLocations) {

        if (hotMealLocation.location) {

          HotMealLocation.findOneAndUpdate(
          { name_of_program: hotMealLocation.name_of_program },
          hotMealLocation,
          { returnNewDocument: true, upsert: true, new: true },
          (err, savedHotMeal) => {
            if (err) return callback(err);
            else callback(null, savedHotMeal);
          }
        );
        }
      }
    });
}

module.exports = exports = getHotMealLocations;
