'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, '..', 'dist');
//const SRC_DIR   = path.resolve(__dirname, '..', 'src');
const DEMO_DIR  = path.resolve(__dirname, '..', 'demo');

module.exports = {
  mode: 'development',
  entry: [ 'babel-polyfill', DEMO_DIR + '/main.js' ],
  output: {
    path: BUILD_DIR,
    filename: '[name].[contenthash].js'
  },
  module : {
    rules : [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.scss$/,
      use: [
        'style-loader', // creates style nodes from JS strings
        'css-loader', // translates CSS into CommonJS
        'sass-loader' // compiles Sass to CSS, using Node Sass by default
      ]
    }, {
      test : /\.js$/,
      use : [{
        loader : 'babel-loader',
        //include : [ DEMO_DIR, SRC_DIR ],
        query : {
          presets: [
            [ '@babel/env', { targets : 'last 2 versions' } ],
            '@babel/react'
          ],
          plugins: [
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-class-properties'
          ]
        }
      }]
    }, {
      test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf|ico)$/,
      use: [ 'file-loader' ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin([ BUILD_DIR ], { root: path.resolve(__dirname, '..') }),
    new webpack.DefinePlugin({
      'process.env': {
        //DEBUG: JSON.stringify('mylife:tools:ui:*')
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(DEMO_DIR, 'index.html')
    })
  ],
  devtool: 'inline-cheap-module-source-map',
  resolve: {
    alias: {
      'mylife-tools-ui': path.resolve(__dirname, '../src'),
    }
  }
};
