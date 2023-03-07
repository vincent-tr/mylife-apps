import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import createConfig, { createWarningFilter, DEFAULT_WARNING_FILTERS } from './config';

type CreateConfig = (env: Record<string, any>, argv: Record<string, any>) => Promise<webpack.Configuration | webpack.Configuration[]>;

export default async (env: Record<string, any>, argv: Record<string, any>) => {
  const createConfig = await loadCreateConfig();
  return await createConfig(env, argv);
}

async function loadCreateConfig(): Promise<CreateConfig> {
  try {
    const { default: customBuild } = await import(path.join(process.cwd(), 'build/server.config'));
    console.log('Using custom build');
    return customBuild;
  } catch(err) {
    console.log('Using default build');
    return defaultBuild;
  }
}

async function defaultBuild(env: Record<string, any>, argv: Record<string, any>) {
  const { baseDirectory, dev } = prepare(env, argv);

  return createConfig(baseDirectory, dev);
}

// export for build customization

export { createConfig };

export function prepare(env: Record<string, any>, argv: Record<string, any>) {
  const baseDirectory = process.cwd();
  const dev = isDev(argv);

  return { baseDirectory, dev };
}

export { webpack, CopyPlugin, createWarningFilter, DEFAULT_WARNING_FILTERS };

// ---

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
