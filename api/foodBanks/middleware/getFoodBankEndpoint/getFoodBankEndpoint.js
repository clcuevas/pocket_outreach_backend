'use strict';
/**
 * @module getFoodBank
 */


/**
 * endpoint that sets status and sends response data to client
 * @function getFoodBankEndpoint
 * @param { Object } req -  express request object
 * @param { Object } res - express response object
 */

function getFoodBankEndpoint(req, res) {
  const status = req.returnVal && req.returnVal.status ? req.returnVal.status : 400;
  const data = req.returnVal && req.returnVal.data ? req.returnVal.data : { 'error' : 'sorry we couldn\'t interpret you\'re request' };
  res.status(status);
  res.json(data);
}

module.exports = exports = getFoodBankEndpoint;
