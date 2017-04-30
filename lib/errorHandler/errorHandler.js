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
 * custom error handler
 * @param err {Error} - the error passed to the error handler
 * @param req {Object} - the Express request object
 * @param res {Object} - the Express response object
 * @param next {Function} - the Express next callback
 */

function errorHandler (err, req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    winston.add(winston.transports.Console);
    winston.error(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
  } else {
    winston.error(err);
    res.status(err.status || 500);
    res.json({ error: 'Something broke' });
  }
}

module.exports = exports = errorHandler;
