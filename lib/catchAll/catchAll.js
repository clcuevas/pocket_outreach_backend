'use strict';

//noinspection JSUnusedLocalSymbols
function catchAll(req, res) {
  res.status(404);
  res.json({
    errors: [ {
      title: 'Error 404 : not found',
      error: 'oops we didn\'t find anything, check out https://data.pocketoutreach.org for available API endpoints and documentation',
      status: 404
    } ]
  });
}

module.exports = exports = catchAll;
