'use strict';

require('../lib/init');
const { runWebServer } = require('mylife-tools-server');
const webpackConfig = require('../webpack.config.dev.js');
const createApi = require('../lib/api');

runWebServer({ webpackConfig, apiCreator : app => { app.use('/api', createApi()); } });
