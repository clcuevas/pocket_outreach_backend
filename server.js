'use strict';

require('dotenv-safe').config();
const express = require('express');
const app = express();
const path = require('path');
const compression = require('compression');
const moment = require('moment');
const winston = require('winston');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const clc = require('cli-color');
const config = require('config');
const expressErrorHandler = require('./lib/expressErrorHandler/expressErrorHandler');
const configuration = config.get('configuration');
const port = configuration.server.port;
const mongoUri = `${configuration.database.host}/${configuration.database.name}`;
const serverStartTime = moment(new Date()).format('LLLL');
const logFilePath = path.join('log', 'pocket_outreach.log');
const api = require('./api');

winston.configure({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'error-file',
      filename: logFilePath,
      level: 'error'
    })
  ]
});

mongoose.connect(mongoUri)
  .then(
  () => {
    winston.info(clc.cyan('successfully connected to database'));
  },
  (err) => {
    winston.error(err);
  }
);

app.use(express.static(path.join(__dirname, 'doc')));
app.use(express.static(path.join(__dirname, 'out')));
app.use(compression());
app.use('/api', api);
app.get('/', (req, res) => {
  const apiDocsIndex = path.join(__dirname, 'doc', 'index.html');
  res.sendfile(apiDocsIndex);
});
app.get('/docs', (req, res) => {
  const jsDocIndex = path.join(__dirname, 'out', 'index.html');
  res.sendfile(jsDocIndex);
});

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    winston.info(clc.yellow(`server started on port ${port} at ${serverStartTime}`));
  }
});

app.use(expressErrorHandler);
