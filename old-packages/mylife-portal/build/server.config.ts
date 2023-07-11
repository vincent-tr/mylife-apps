import path from 'path';
import { prepare, createConfig, CopyPlugin, createWarningFilter, DEFAULT_WARNING_FILTERS } from 'mylife-tools-build/server';

export default (env: Record<string, any>, argv: Record<string, any>) => {
  const { baseDirectory, dev } = prepare(env, argv);
  const config = createConfig(baseDirectory, dev);

  config.plugins = config.plugins || [];
  config.plugins.push(new CopyPlugin({
    patterns: [
      { from: path.join(baseDirectory, 'public'), to: 'static' },
      { from: path.join(baseDirectory, 'node_modules/bootstrap/dist/css/bootstrap.min.css'), to: 'static/bootstrap/css/bootstrap.min.css' },
      { from: path.join(baseDirectory, 'node_modules/bootstrap/dist/fonts'), to: 'static/bootstrap/fonts' }
    ],
  }));

  config.stats = {
    warningsFilter: createWarningFilter(...DEFAULT_WARNING_FILTERS, 'handlebars')
  };

  return config;
}
