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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};

module.exports = config;
