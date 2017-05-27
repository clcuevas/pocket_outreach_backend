'use strict';

const mongoose = require('mongoose');
const foodBankSchema = require('../schemas/foodBankSchema');

module.exports = exports = mongoose.model('FoodBank', foodBankSchema);
