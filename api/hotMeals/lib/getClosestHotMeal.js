'use strict';

function getClosestHotMeal(req, res, next) {
  // if the correct queries are not included, return bad request and error message
  if (!req.query.latitude || !req.query.longitude) {
    req.returnVal = {
      status: 400,
      data: { error: 'Invalid or missing query string' }
    };
    next();
  } else {
    next();
  }
}

module.exports = exports = {
  get: getClosestHotMeal
};
