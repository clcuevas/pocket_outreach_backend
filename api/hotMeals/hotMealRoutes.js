'use strict';

const router = require('express').Router();
const config = require('config');
const socrataHotMealsAPI = config.get('resources.socrata.hot_meals');
const addLatLngFromGoogle = require('./lib/addLatLngFromGoogle');
const getHotMealLocations = require('./lib/getHotMealLocations');
const getClosestHotMeal = require('./middleware/getClosestHotMeal');
const getClosestHotMealEndpoint = require('./middleware/getClosestHotMealEndpoint');

// get closest hot meal locations from API then repeat once every 24 hours
getHotMealLocations(socrataHotMealsAPI.seattle, addLatLngFromGoogle);
setInterval(() => {
  getHotMealLocations(socrataHotMealsAPI, addLatLngFromGoogle);
}, 86400000);

router.get('/hot-meal/closest', getClosestHotMeal, getClosestHotMealEndpoint);

module.exports = exports = router;
