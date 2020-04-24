'use strict';

const util              = require('util');
const path              = require('path');
const http              = require('http');
const express           = require('express');
const enableDestroy     = require('server-destroy');
const { getConfig, getArg } = require('mylife-tools-server');
const createIndexRoutes = require('./index-routes');
const createApiRoutes   = require('./api-routes');

const debug = require('debug')('mylife:explorer:web:server');

module.exports = class Server {

  constructor() {
    const app = express();
    const config = getConfig('webServer');
    const dev = getArg('dev');

    if(dev) {
      debug('setup webpack dev middleware');

      // lazy require dev dependencies
      const webpack           = require('webpack');
      const webpackMiddleware = require('webpack-dev-middleware');
      const webpackConfig     = require('../../webpack.config');
      const finalConfig = Object.assign({}, webpackConfig, { mode: 'development' });

      app.use(webpackMiddleware(webpack(finalConfig), { publicPath: finalConfig.output.publicPath }));
    }

    const publicDirectory = path.resolve(path.join(__dirname, '../../public'));
    app.use(express.static(publicDirectory, { index : false }));

    app.use(createIndexRoutes());
    app.use('/api', createApiRoutes());

    this._server = http.Server(app);
    enableDestroy(this._server);

    debug(`Start listening on port ${config.port}`);
    this._server.listen(config.port);
  }

  async close() {
    await util.promisify(done => this._server.close(done));
    this._server.destroy();
  }
};
