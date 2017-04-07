'use strict';
const winston = require('winston');

function errorHandler (err, req, res, next) {
  if (res.headersSent || process.env.NODE_ENV !== 'production') {
    next(err);
  } else {
    winston.error(err);
  }
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
}

module.exports = exports = errorHandler;
