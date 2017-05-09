'use strict';

/**
 * @module errorHandler
 */

const errorHandler = require('../errorHandler/errorHandler');

//noinspection JSUnusedLocalSymbols
/**
 * custom error handler
 * @param err {Error} - the error passed to the error handler
 * @param req {Object} - the Express request object
 * @param res {Object} - the Express response object
 * @param next {Function} - the Express next callback
 */
// eslint-disable-next-line
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
