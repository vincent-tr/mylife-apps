'use strict';

const util              = require('util');
const path              = require('path');
const http              = require('http');
const express           = require('express');
const enableDestroy     = require('server-destroy');
//const routes            = require('./routes');

const debug = require('debug')('mylife:gallery:web:server');

module.exports = class Server {

  constructor(options = {}) {
    const app = express();

    if(options.dev) {
      debug('setup webpack dev middleware');

      // lazy require dev dependencies
      const webpack           = require('webpack');
      const webpackMiddleware = require('webpack-dev-middleware');
      const webpackConfig     = require('../../webpack.config/dev');

      app.use(webpackMiddleware(webpack(webpackConfig), { publicPath: webpackConfig.output.publicPath }));
    }

    const publicDirectory = path.resolve(path.join(__dirname, '../../public'));
    app.use(express.static(publicDirectory));

    //routes.register(app);

    this._server = http.Server(app);
    enableDestroy(this._server);

    debug(`Start listening on port ${options.port}`);
    this._server.listen(options.port);
  }

  async close() {
    await util.promisify(done => this._server.close(done));
    this._server.destroy();
  }
};
