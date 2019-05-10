'use strict';

const path              = require('path');
const http              = require('http');
const express           = require('express');
const enableDestroy     = require('server-destroy');
const bodyParser        = require('body-parser');
const favicon           = require('serve-favicon');
const serveStatic       = require('serve-static');
const webpack           = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig     = require('../webpack.config.dev.js');
const createApi         = require('./api');

const { createLogger, getConfig, getArg } = require('mylife-tools-server');
const log = createLogger('mylife:money:lib:server');

module.exports = class {

  constructor({ config = getConfig(), dev = getArg('dev') } = {}) {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '100mb' }));

    const publicDirectory = path.resolve(path.join(__dirname, '../public'));

    if(dev) {
      log.info('setup webpack dev middleware');
      app.use(webpackMiddleware(webpack(webpackConfig), { publicPath: webpackConfig.output.publicPath }));
    }
    app.use(favicon(path.join(publicDirectory, 'images/favicon.ico')));
    app.use('/api', createApi());
    app.use(serveStatic(publicDirectory));

    this._server = http.Server(app);
    enableDestroy(this._server);

    this._server.listen(config.webServer);
    log.info(`server created : ${JSON.stringify(config.webServer)}`);
  }

  close(done) {
    log.info('server close');
    this._server.close(done);
    this._server.destroy();
  }
};
