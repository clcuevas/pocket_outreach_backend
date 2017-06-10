'use strict';

require('dotenv-safe').config();
const express = require('express');
const app = express();
const path = require('path');
const compression = require('compression');
const moment = require('moment');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const clc = require('cli-color');
const config = require('config');
const cors = require('cors');
const expressErrorHandler = require('./lib/expressErrorHandler/expressErrorHandler');
const configuration = config.get('configuration');
const port = configuration.server.port;
const corsOptions = configuration.corsOptions;
const mongoUri = `${configuration.database.host}/${configuration.database.name}`;
const serverStartTime = moment(new Date()).format('LLLL');
const errorHandler = require('./lib/errorHandler/errorHandler');
const catchAll = require('./lib/catchAll/catchAll');
const api = require('./api');
const docs = require('./docs');

mongoose.connect(mongoUri)
  .then( () => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(clc.cyan('successfully connected to database'));
    }
  },
  (err) => {
    errorHandler(err);
  }
);

app.use(cors(corsOptions));
app.use(compression());
app.use(express.static(path.join(__dirname, 'out_apidoc')));
app.use(express.static(path.join(__dirname, 'out')));
app.use('/api', api);
app.use('/', docs);
app.get('*', catchAll);

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(clc.yellow(`server started on port ${port} at ${serverStartTime}`));
  }
});

app.use(expressErrorHandler);
