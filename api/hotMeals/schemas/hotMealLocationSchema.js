'use strict';

const mongoose = require('mongoose');

const hotMealLocationSchema = new mongoose.Schema({
  day_time: String,
  location: String,
  meal_served: String,
  name_of_program: String,
  people_served: String,
  latitude: String,
  longitude: String
});

module.exports = exports = hotMealLocationSchema;
