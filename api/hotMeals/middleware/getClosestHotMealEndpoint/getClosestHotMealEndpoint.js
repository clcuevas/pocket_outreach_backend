'use strict';
/**
 * @module getClosestHotMeals
 */

/**
 * endpoint for get request for closest hot meal locations
 * @function getClosestHotMealEndPoint
 * @param {Object} req - the express request object
 * @param {Object} res - the express response object
 */

function getClosestHotMealEndPoint(req, res) {
  const status = req.returnVal && req.returnVal.status ? req.returnVal.status : 400;
  const data = req.returnVal && req.returnVal.data ? req.returnVal.data : { 'error' : 'sorry we couldn\'t interpret you\'re request' };
  res.status(status);
  res.json(data);

}

module.exports = exports = getClosestHotMealEndPoint;
