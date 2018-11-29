'use strict';

const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, '..', 'dist');
const SRC_DIR   = path.resolve(__dirname, '..', 'src');
const DEMO_DIR   = path.resolve(__dirname, '..', 'demo');

module.exports = {
  mode: 'development',
  entry: [ 'babel-polyfill', DEMO_DIR + '/main.js' ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    rules : [{
      test: /\.scss$/,
      use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
      ]
    }, {
        test : /\.js/,
        use : [{
          loader : 'babel-loader',
          //include : [ DEMO_DIR, SRC_DIR ],
          query : {
            presets: [
              [ '@babel/env', { targets : 'last 2 versions' } ],
              '@babel/react'
            ],
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        //DEBUG: JSON.stringify('mylife:tools:ui:*')
      }
    })
  ],
  devtool: 'eval'
};