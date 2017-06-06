'use strict';

const express = require('express');
const router = express.Router();

const foodBankRoutes = require('./foodBanks/foodBanksRoutes');
const hotMealRoutes = require('./hotMeals/hotMealRoutes');

router.use('/', foodBankRoutes);
router.use('/hot-meal-locations', hotMealRoutes);

module.exports = exports = router;
