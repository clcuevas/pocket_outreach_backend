'use strict';

function getFoodBank(req, res, next) {
  console.log('req.query : ', req.query);
  next();
}

module.exports = exports = getFoodBank;