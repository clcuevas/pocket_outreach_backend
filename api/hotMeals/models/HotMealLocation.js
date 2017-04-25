'use strict';

const mongoose = require('mongoose');
const hotMealLocationSchema = require('../schemas/hotMealLocationSchema');

module.exports = exports = mongoose.model('HotMealLocation', hotMealLocationSchema);
