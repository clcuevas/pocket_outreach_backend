'use strict';

const express = require('express');
const router = express.Router();

const foodBankRoutes = require('./foodBanks/foodBankRoutes');
const hotMealRoutes = require('./hotMeals/hotMealRoutes');

router.use('/food-banks', foodBankRoutes);
router.use('/hot-meal-locations', hotMealRoutes);

module.exports = exports = router;
