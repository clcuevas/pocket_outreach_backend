'use strict';

/**
 * @module errorHandler
 */
const winston = require('winston');
const path = require('path');

const logFilePath = path.join(__dirname, '../../log', 'pocket_outreach.log');

const devLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'error-file',
      filename: logFilePath,
      level: 'error'
    })
  ]
});

const prodLogger = new (winston.Logger)({
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
    prodLogger.error(error);
  } else {
    devLogger.error(error);
  }
}

module.exports = exports = errorHandler;
