import createUiConfig from './ui';
import createServerConfig from './server';

export default (env: Record<string, any>, argv: Record<string, any>) => {
  const baseDirectory = process.cwd();
  const dev = isDev(argv);

  return [
    createUiConfig(baseDirectory, dev),
    createServerConfig(baseDirectory, dev),
  ]
}

function isDev( argv: Record<string, any>) {
  switch(argv.mode) {
    case 'production':
      return false;
    case 'development':
      return true;
    default:
      throw new Error('Could not get mode');
  }
}