'use strict';

const path            = require('path');
const webpack         = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR   = path.resolve(__dirname, 'public/app');

module.exports = {
  entry: [ 'babel-polyfill', APP_DIR + '/main.js' ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : [ APP_DIR ],
        loader : 'babel-loader',
        query : {
          presets: [
            [ 'env', { target : { browsers : [ 'last 2 versions' ] } } ],
            'react',
            'stage-2'
          ],
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=100000&mimetype=image/svg+xml'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        DEBUG: JSON.stringify('mylife:gallery:*')
      }
    })
  ],
  devtool: 'eval'
};