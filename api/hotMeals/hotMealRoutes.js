'use strict';

const router = require('express').Router();
const config = require('config');
const socrataHotMealsAPI = config.get('resources.socrata.hot_meals');
const addLatLngFromGoogle = require('./lib/addLatLngFromGoogle/addLatLngFromGoogle');
const getHotMealLocations = require('./lib/getHotMealLocations/getHotMealLocations');
const getClosestHotMeal = require('./middleware/getClosestHotMeal/getClosestHotMeal');
const getClosestHotMealEndpoint = require('./middleware/getClosestHotMealEndpoint/getClosestHotMealEndpoint');
const HotMealLocation = require('./models/HotMealLocation');
const errorHandler = require('../../lib/errorHandler/errorHandler');

/*
* Get closest hot meal locations from API then repeat once every 24 hours if in production mode.
* If in dev mode, check if there are values in the collection and call the function only if the
* collection is empty.
*/

if (process.env.NODE_ENV === 'development' || 'dev') {
  HotMealLocation.find({}, (error, hotMealLocations) => {
    if (error) errorHandler(error);
    if (!hotMealLocations.length)
      getHotMealLocations(socrataHotMealsAPI.seattle, addLatLngFromGoogle);
  });
} else {
  getHotMealLocations(socrataHotMealsAPI.seattle, addLatLngFromGoogle);
  setInterval(() => {
    getHotMealLocations(socrataHotMealsAPI.seattle, addLatLngFromGoogle);
  }, 86400000);
}

router.get('/hot-meals', getClosestHotMeal, getClosestHotMealEndpoint);

module.exports = exports = router;
