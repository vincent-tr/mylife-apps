'use strict';

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

exports.createWebpackConfig = function ({
  baseDirectory,
  outputPath = path.join(baseDirectory, 'public'),
  entryPoint = path.join(baseDirectory, 'public/src/main.tsx'),
  htmlTemplate = path.join(baseDirectory, 'public/src/index.html'),
  dev = false
} = {}) {

  const resolverPaths = [mpath('mylife-tools-ui'), mpath('mylife-tools-build'), 'node_modules'];

  const babelOptions = {
    presets: [
      [ require.resolve('@babel/preset-env'), { targets : 'last 2 versions' } ],
      require.resolve('@babel/preset-react')
    ],
    plugins: [
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      require.resolve('@babel/plugin-proposal-class-properties')
    ]
  };

  const common = {
    entry: [ 'babel-polyfill', entryPoint ],
    output: {
      publicPath: '/',
      path: outputPath
    },
    module : {
      rules : [{
        test : /\.js(x?)$/,
        use : [{ loader : 'babel-loader', options : babelOptions }]
      }, {
        test : /\.ts(x?)$/,
        use : [
          { loader : 'babel-loader', options : babelOptions },
          { loader: 'ts-loader', options: { context: outputPath, configFile: path.join(__dirname, 'tsconfig.json') } }
        ]
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
      modules: resolverPaths,
      extensions: ['.wasm', '.mjs', '.js', '.ts', '.tsx', '.json']
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

  function mpath(moduleName) {
    return path.join(baseDirectory, 'node_modules', moduleName, 'node_modules');
  }
};
