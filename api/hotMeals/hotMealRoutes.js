'use strict';
const router = require('express').Router();
const config = require('config');
const googleLocationApi = config.get('resources.socrata.hot_meals');
const addLatLngFromGoogle = require('./lib/addLatLngFromGoogle');
const getHotMealLocations = require('./lib/getHotMealLocations');


