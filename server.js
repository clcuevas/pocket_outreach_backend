'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const compression = require('compression');
const moment = require('moment');
const clc = require('cli-color');
const winston = require('winston');

const port = process.env.PORT;
const serverStartTime = moment(new Date()).format('LLLL');

const api = require('./api');

app.use(compression());
app.use('/api', api);

app.listen(port, () => {
  winston.info(clc.yellow(`server started on port ${port} at ${serverStartTime}`));
});
