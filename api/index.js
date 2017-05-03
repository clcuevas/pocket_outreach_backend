'use strict';

const express = require('express');
const router = express.Router();

const foodBankRoutes = require('./foodBanks/foodBanksRoutes');
const hotMealRoutes = require('./hotMeals/hotMealRoutes');

router.use('/', foodBankRoutes);
router.use('/', hotMealRoutes);

module.exports = exports = router;
