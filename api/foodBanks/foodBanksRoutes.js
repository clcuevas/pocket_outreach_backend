'use strict';

const express = require('express');
const router = express.Router();

const getFoodBank = require('./getFoodBank/getFoodBank');

router.route('/food-banks')
  .get(getFoodBank, (req, res) => {
    res.json(JSON.parse(req.foodBanks.text));
  });

module.exports = exports = router;
