import { prepare, createServerConfig } from 'mylife-tools-build/webpack.config';

export default (env: Record<string, any>, argv: Record<string, any>) => {
  const { baseDirectory, dev } = prepare(env, argv);
  return createServerConfig(baseDirectory, dev);
}
