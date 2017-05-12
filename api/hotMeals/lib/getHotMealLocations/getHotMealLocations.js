'use strict';

const winston = require('winston');
const request = require('superagent');
const HotMealLocation = require('../../models/HotMealLocation');

function getHotMealLocations(url, callback) {
  // call the API and get the food banks
  request
  .get(url)
  .set({'X-App-Token': process.env.SOCRATA_DATA_API_KEY, 'Accept': 'application/json'})
  .end((err, response) => {
    if (err) {
      return winston.error(err);
    }
    const hotMealLocations = JSON.parse(response.text);

    for (const hotMealLocation of hotMealLocations) {

      if (hotMealLocation.location) {

        HotMealLocation.findOneAndUpdate(
          { name_of_program: hotMealLocation.name_of_program },
          hotMealLocation,
          { returnNewDocument: true, upsert: true, new: true }
        )
        .then(savedHotMeal => callback(null, savedHotMeal) )
        .catch(error => callback(error) );
      }
    }
  });
}

module.exports = exports = getHotMealLocations;
