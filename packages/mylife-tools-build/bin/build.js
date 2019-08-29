#!/usr/bin/env node

'use strict';

const webpack                 = require('webpack');
const { createWebpackConfig } = require('../lib/webpack-config');

const webpackConfig = createWebpackConfig({ baseDirectory: process.cwd() });
const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err.stack || err);
    if (err.details) {
      // eslint-disable-next-line no-console
      console.error(err.details);
    }
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(stats.toString({
    chunks: false,
    colors: true
  }));

  if(stats.hasErrors()) {
    process.exit(1);
  }
});
