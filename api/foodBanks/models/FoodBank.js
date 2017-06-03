'use strict';

const mongoose = require('mongoose');

const foodBankSchema = mongoose.Schema({
  address: String,
  city_feature: String,
  common_name: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  location: {
    location_type: String,
    coordinates: [ Number ]
  },
  website: String,
  hours: String,
  phone: String
});

module.exports = exports = mongoose.model('FoodBank', foodBankSchema);
