'use strict';

const express = require('express');
const router = express.Router();

const foodBankRoutes = require('./foodBanks/foodBanksRoutes');

router.use('/', foodBankRoutes);

module.exports = exports = router;
