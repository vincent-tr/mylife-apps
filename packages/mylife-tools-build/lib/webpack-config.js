'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

exports.createWebpackConfig = function ({
  baseDirectory,
  outputPath = path.join(baseDirectory, 'public'),
  entryPoint = path.join(baseDirectory, 'public/src/main.js'),
  htmlTemplate = path.join(baseDirectory, 'public/src/index.html'),
  dev = false
} = {}) {

  const resolverPaths = ['node_modules', mpath('mylife-tools-ui'), mpath('mylife-tools-build')];

  const common = {
    entry: [ 'babel-polyfill', entryPoint ],
    output: {
      publicPath: '/',
      path: outputPath
    },
    module : {
      rules : [{
        // TODO: https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }, {
        // TODO: // TODO: https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
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
          //include : [ entryPoint ],
          query : {
            presets: [
              [ require.resolve('@babel/preset-env'), { targets : 'last 2 versions' } ],
              require.resolve('@babel/preset-react')
            ],
            plugins: [
              require.resolve('@babel/plugin-proposal-export-default-from'),
              require.resolve('@babel/plugin-proposal-export-namespace-from'),
              require.resolve('@babel/plugin-proposal-class-properties')
            ]
          }
        }]
      }, {
        test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf|ico)$/,
        use: [ 'file-loader' ]
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          //DEBUG: JSON.stringify('mylife:tools:ui:*')
        }
      }),
      new HtmlWebpackPlugin({
        template: htmlTemplate
      }),
      new ProgressBarPlugin()
    ],
    resolve: {
      modules: resolverPaths
    },
    resolveLoader: {
      modules: resolverPaths
    }
  };

  if(dev) {
    return merge(common, {
      mode: 'development',
      entry: ['webpack-hot-middleware/client'],
      output: {
        filename: '[name].[hash].js'
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
      ],
      devtool: 'inline-cheap-module-source-map',
    });
  }

  return merge(common, {
    mode: 'production',
    output: {
      filename: '[name].[contenthash].js'
    },
    devtool: 'source-map'
  });

  // in dev mode, we are linked with lerna, so we need to add modules to dependency lookup
  function mpath(moduleName) {
    return path.join(baseDirectory, 'node_modules', moduleName, 'node_modules');
  }
};
