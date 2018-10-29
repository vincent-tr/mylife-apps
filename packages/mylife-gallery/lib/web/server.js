'use strict';

const util               = require('util');
const path               = require('path');
const http               = require('http');
const express            = require('express');
const enableDestroy      = require('server-destroy');
const createIndexRoutes  = require('./index-routes');
const createImagesRoutes = require('./images-routes');
const createApiRoutes    = require('./api-routes');
const config             = require('../../conf/config');

const debug = require('debug')('mylife:gallery:web:server');

module.exports = class Server {

  constructor(options) {
    const app = express();

    if(options.dev) {
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
    app.use('/images', createImagesRoutes());
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
