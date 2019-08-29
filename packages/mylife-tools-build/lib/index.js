'use strict';

const webpack                 = require('webpack');
const webpackDevMiddleware    = require('webpack-dev-middleware');
const webpackHotMiddleware    = require('webpack-hot-middleware');
const { createWebpackConfig } = require('./webpack-config');

exports.setupDevMiddleware = (app, webpackConfig, baseDirectory) => {
  webpackConfig = webpackConfig || createWebpackConfig({ baseDirectory, dev: true });

  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, { publicPath: webpackConfig.output.publicPath });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  return { webpackConfig, compiler, middleware };
};
