'use strict';

exports.buildWeb = async (baseDirectory) => {
  const webpack                 = require('webpack');
  const { createWebpackConfig } = require('./webpack-config');

  const webpackConfig = createWebpackConfig({ baseDirectory });
  const compiler = webpack(webpackConfig);

  return new Promise((resolve) => {

    compiler.run((err, stats) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err.stack || err);
        if (err.details) {
          // eslint-disable-next-line no-console
          console.error(err.details);
        }

        return resolve(false);
      }

      // eslint-disable-next-line no-console
      console.log(stats.toString({
        chunks: false,
        colors: true
      }));

      if(stats.hasErrors()) {
        return resolve(false);
      }

      return resolve(true);
    });
  });
};
