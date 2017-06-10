'use strict';

const fs = require('fs');
const path = require('path');

//noinspection JSUnusedLocalSymbols
function serveJsDoc(req, res) {
  const apiDocIndex = path.join(__dirname, '../..', 'out', 'index.html');

  if (!fs.existsSync(apiDocIndex)) {
    res.status(404);
    res.json({
      errors: [ {
        error: 'not found',
        status: 404
      } ]
    });
  } else {
    res.status(200);
    res.sendFile(apiDocIndex);
  }
}

module.exports = exports = serveJsDoc;
