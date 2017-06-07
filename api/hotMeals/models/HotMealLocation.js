'use strict';

const mongoose = require('mongoose');
const hotMealLocationSchema = new mongoose.Schema({
  day_time: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  meal_served: {
    type: String,
    default: ''
  },
  name_of_program: {
    type: String,
    required: true
  },
  people_served: {
    type: String,
    default: ''
  },
  latitude: {
    type: String,
    default: ''
  },
  longitude: {
    type: String,
    default: ''
  }
});

module.exports = exports = mongoose.model('HotMealLocation', hotMealLocationSchema);
