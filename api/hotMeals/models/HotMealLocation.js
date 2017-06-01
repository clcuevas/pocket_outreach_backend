'use strict';

const mongoose = require('mongoose');
const hotMealLocationSchema = new mongoose.Schema({
  day_time: String,
  location: String,
  meal_served: String,
  name_of_program: {
    type: String,
    required: true
  },
  people_served: String,
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  }
});

module.exports = exports = mongoose.model('HotMealLocation', hotMealLocationSchema);
