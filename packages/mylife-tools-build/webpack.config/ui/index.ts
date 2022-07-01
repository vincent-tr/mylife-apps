import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default function (baseDirectory: string, dev: boolean) {
  const sourcePath = path.join(baseDirectory, 'public');
  const outputPath = path.join(baseDirectory, 'dist', dev ? 'dev' : 'prod', 'static');
  const entryPoint = path.join(sourcePath, 'src', 'main.tsx');
  const htmlTemplate = path.join(sourcePath, 'src', 'index.html');

  const resolverPaths = [mpath('mylife-tools-ui'), mpath('mylife-tools-build'), 'node_modules'];

  const babelOptions = {
    presets: [[require.resolve('@babel/preset-env'), { targets: 'last 2 versions' }], require.resolve('@babel/preset-react')],
    plugins: [
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      require.resolve('@babel/plugin-proposal-class-properties'),
    ],
  };

  const config: webpack.Configuration = {
    name: 'ui',
    entry: entryPoint,
    output: {
      publicPath: '/',
      path: outputPath,
    },
    module: {
      rules: [
        {
          test: /\.js(x?)$/,
          use: [{ loader: 'babel-loader', options: babelOptions }],
        },
        {
          test: /\.ts(x?)$/,
          use: [
            { loader: 'babel-loader', options: babelOptions },
            { loader: 'ts-loader', options: { context: sourcePath, configFile: path.join(__dirname, 'tsconfig.json') } },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf|ico)$/,
          use: ['file-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: htmlTemplate,
      }),
    ],
    resolve: {
      modules: resolverPaths,
      extensions: ['.wasm', '.mjs', '.js', '.ts', '.tsx', '.json'],
    },
    resolveLoader: {
      modules: resolverPaths,
    },
    devtool: dev ? 'inline-source-map' : 'nosources-source-map',
  };

  return config;

  function mpath(moduleName: string) {
    return path.join(baseDirectory, 'node_modules', moduleName, 'node_modules');
  }
}
