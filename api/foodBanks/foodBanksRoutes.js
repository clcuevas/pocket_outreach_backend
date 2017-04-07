'use strict';

const express = require('express');
const router = express.Router();

const getFoodBank = require('./getFoodBank/getFoodBank');

/**
 * @api {get} /food-banks/closest Request closest food bank
 * @apiGroup food banks
 * @apiVersion 1.0.0
 * @apiParam {String} latitude Mandatory value. Submitted as a query string and formatted in signed degree format.
 * @apiParam {String} longitude Mandatory value. Submitted as a query string and formatted in signed degree format.
 * @apiExample Example usage:
 * http://example.com/food-banks/closest/?latitude=47.673554&longitude=-122.387062
 * @apiSuccess {JSON} returns  On success returns JSON object containing closest food bank
 * @apiSuccessExample {json} Success-Response:
 *    {
 *     "address": "7005 24th Ave NW",
 *     "city_feature": "Food Banks",
 *     "common_name": "Ballard Food Bank",
 *     "latitude": "47.679582",
 *     "location": {
 *       "type": "Point",
 *       "coordinates": [
 *         -122.387661,
 *         47.679582
 *       ]
 *     },
 *     "longitude": "-122.387661",
 *     "website": "http://www.ballardfoodbank.org",
 *     "distance": 0.4174263197848783
 *   }
 * @apiError (Error 400) {JSON} returns With an invalid or missing query string returns JSON object with "error" key
 * and description of the error
 * @apiErrorExample {JSON} Error-Response:
 *    {
 *      "error": "Invalid or missing query string"
 *    }
 */

router.get('/food-banks/closest', getFoodBank, (req, res) => {
  res.status(req.returnVal.status);
  res.json(req.returnVal.data);
});

module.exports = exports = router;
