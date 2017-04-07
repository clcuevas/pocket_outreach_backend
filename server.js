'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const compression = require('compression');
const moment = require('moment');
const clc = require('cli-color');
const winston = require('winston');
const errorHandler = require('./lib/errorHandler');
const port = process.env.PORT;
const serverStartTime = moment(new Date()).format('LLLL');
const logFilePath = path.join('log', 'pocket_outreach.log');
winston.configure({
  transports: [
    new (winston.transports.File)({
      name: 'error-file',
      filename: logFilePath,
      level: 'error'
    })
  ]
});

const api = require('./api');

app.use(compression());
app.use('/api', api);

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    winston.info(clc.yellow(`server started on port ${port} at ${serverStartTime}`));
  }
});

app.use(errorHandler);
