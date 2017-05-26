'use strict';

const mongoose = require('mongoose');

const foodBankSchema = mongoose.Schema({
  address: String,
  city_feature: String,
  common_name: String,
  latitude: String,
  longitude: String,
  location: {
    location_type: String,
    coordinates: [ Number ]
  },
  website: String
});

module.exports = exports = foodBankSchema;
