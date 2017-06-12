'use strict';
/**
 * @module getHotMeals
 */

/**
 * endpoint for get request for closest hot meal locations
 * @function hotMealEndPoints
 * @param {Object} req - the express request object
 * @param {Object} res - the express response object
 */

function hotMealEndPoints(req, res) {
  const status = req.returnVal && req.returnVal.status ? req.returnVal.status : 400;

  const data = req.returnVal && (req.returnVal.data || req.returnVal.errors) ? req.returnVal : {
    errors: [ {
      error: 'sorry we couldn\'t interpret you\'re request',
      status: 400
    } ]
  };
  res.status(status);
  res.json(data);

}

module.exports = exports = hotMealEndPoints;
