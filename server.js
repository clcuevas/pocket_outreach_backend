'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const compression = require('compression');
const moment = require('moment');
const clc = require('cli-color');

const port = process.env.PORT;
const serverStartTime = moment(new Date()).format('LLLL');

app.use(compression());

app.listen(port, () => {
  console.log(clc.green(`server started on port ${port} at ${serverStartTime}`));
});