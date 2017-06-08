'use strict';
/**
 * @module getFoodBank
 */


/**
 * endpoint that sets status and sends response data to client
 * @function getFoodBanksEndpoint
 * @param { Object } req -  express request object
 * @param { Object } res - express response object
 */

function getFoodBanksEndpoint(req, res) {
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

module.exports = exports = getFoodBanksEndpoint;
