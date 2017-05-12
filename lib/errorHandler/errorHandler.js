'use strict';

/**
 * @module errorHandler
 */
const winston = require('winston');
const path = require('path');

const logFilePath = path.join(__dirname, '../../log', 'pocket_outreach.log');

winston.configure({
  transports: [
    new (winston.transports.File)({
      name: 'error-file',
      filename: logFilePath,
      level: 'error'
    })
  ]
});

/**
 * error handler
 * @function errorHandler
 * @param {Object} error - the error object
 */

function errorHandler(error) {

  if (process.env.NODE_ENV !== 'production') {
    winston.add(winston.transports.Console);
    winston.error(error);
  } else {
    winston.error(error);
  }
}

module.exports = exports = errorHandler;
