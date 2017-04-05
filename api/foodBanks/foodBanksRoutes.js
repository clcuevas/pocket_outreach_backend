'use strict';

const express = require('express');
const router = express.Router();

const getFoodBank = require('./getFoodBank/getFoodBank');

router.get('/food-banks/closest', getFoodBank, (req, res) => {
  res.status(req.returnVal.status)
  .send(req.returnVal.data);
});

module.exports = exports = router;
