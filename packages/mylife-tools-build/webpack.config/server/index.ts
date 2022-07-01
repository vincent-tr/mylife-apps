import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

export default function (baseDirectory: string, dev: boolean) {
  const sourcePath = path.join(baseDirectory, 'src');
  const outputPath = path.join(baseDirectory, 'dist', dev ? 'dev' : 'prod');
  const entryPoint = path.join(baseDirectory, 'bin', 'server.ts');

  const resolverPaths = [mpath('mylife-tools-server'), mpath('mylife-tools-build'), 'node_modules'];

  const config: webpack.Configuration = {
    name: 'server',
    entry: { 
      'server': entryPoint,
    },
    output: {
      filename: '[name].js',
      path: outputPath,
    },
    module: {
      rules: [
        /*{
          test: /\.js(x?)$/,
          use: [],
        },*/
        {
          test: /\.ts(x?)$/,
          use: [{ loader: 'ts-loader', options: { context: sourcePath, configFile: path.join(__dirname, 'tsconfig.json') } }],
        },
      ],
    },
    resolve: {
      modules: resolverPaths,
      extensions: ['.wasm', '.mjs', '.js', '.ts', '.tsx', '.json'],
    },
    resolveLoader: {
      modules: resolverPaths,
    },
    devtool: dev ? 'inline-source-map' : 'nosources-source-map',
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
  };

  if (!dev) {
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ],
    };
  }
  
  return config;

  function mpath(moduleName: string) {
    return path.join(baseDirectory, 'node_modules', moduleName, 'node_modules');
  }
}
