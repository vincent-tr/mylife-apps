const path    = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'public');
const SRC_DIR   = path.resolve(__dirname, 'public/src');

const config = {
  entry: SRC_DIR + '/main.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel',
        query: {
          presets:[ 'es2015', 'react', 'stage-2' ]
        }
      }
    ]
  },
  devtool: 'eval'
};

module.exports = config;
