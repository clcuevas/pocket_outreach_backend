'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const compression = require('compression');
const moment = require('moment');
const winston = require('winston');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const clc = require('cli-color');
const errorHandler = require('./lib/errorHandler');
const port = process.env.PORT;
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

mongoose.connect(process.env.MONGODB_URI)
.then(
  () => {
    winston.info(clc.cyan('successfully connected to database'));
  },
  (err) => {
    winston.error(err);
  }
);
// TODO these functions create the hotmeallocations, move them somewhere else
// const getLatLong = require('./api/hotMeals/lib/addLatLngFromGoogle');
// require('./api/hotMeals/lib/getHotMealLocations')(getLatLong);

app.use(compression());
app.use('/api', api);

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    winston.info(clc.yellow(`server started on port ${port} at ${serverStartTime}`));
  }
});

app.use(errorHandler);
