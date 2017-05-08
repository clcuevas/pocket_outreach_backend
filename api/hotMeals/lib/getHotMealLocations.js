'use strict';

const winston = require('winston');
const request = require('superagent');
const HotMealLocation = require('../models/HotMealLocation');
const config = require('config');

function getHotMealLocations(url, callback) {
  // HotMealLocation.collection.drop();
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
        const hotMeal = new HotMealLocation(hotMealLocation);
        hotMeal.save((err, savedHotMeal) => {
          if (err) callback(err);
          if (callback) callback(null, savedHotMeal);
        });
      }
    }
  });
}

module.exports = exports = getHotMealLocations;
