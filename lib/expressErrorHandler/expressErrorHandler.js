'use strict';

/**
 * @module errorHandler
 */

const errorHandler = require('../errorHandler/errorHandler');

//noinspection JSUnusedLocalSymbols
/**
 * custom express error handler
 * @param {Error} err - the error passed to the error handler
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @param {Function} next - the Express next callback
 */
// eslint-disable-next-line no-unused-vars
function expressErrorHandler (err, req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    errorHandler(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
  } else {
    errorHandler(err);
    res.status(err.status || 500);
    res.json({ error: 'Something broke' });
  }
}

module.exports = exports = expressErrorHandler;
