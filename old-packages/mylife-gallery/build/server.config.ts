import fs from 'fs';
import path from 'path';
import { webpack, prepare, createConfig, CopyPlugin, createWarningFilter, DEFAULT_WARNING_FILTERS } from 'mylife-tools-build/server';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

export default (env: Record<string, any>, argv: Record<string, any>) => {
  const { baseDirectory, dev } = prepare(env, argv);

  const config = createConfig(baseDirectory, dev);

  config.plugins = config.plugins || [];

  config.plugins.push(new CopyPlugin({
    patterns: [
      { from: ffmpegStatic, to: 'ffmpeg' },
      { from: ffprobeStatic.path, to: 'ffmpeg' },
    ],
  }));

  config.plugins.push(new MakeExecutablePlugin({ files: [
    'ffmpeg/ffmpeg',
    'ffmpeg/ffprobe',
  ] }));

  // ignore import which is only used by sepcial env var
  config.plugins.push(new webpack.IgnorePlugin({ 
    contextRegExp: /mylife-gallery\/node_modules\/fluent-ffmpeg$/,
    resourceRegExp: /^\.\/lib-cov\/fluent-ffmpeg$/
  }));

  config.stats = {
    warningsFilter: createWarningFilter(...DEFAULT_WARNING_FILTERS, 'fluent-ffmpeg')
  };

  return config;
}

class MakeExecutablePlugin {
  private readonly files: string[];

  constructor({ files }: { files: string[] }) {
    this.files = files;
  }

  private makeExecutable(compilation: webpack.Compilation) {
    for (const file of this.files) {
      fs.chmodSync(path.join(compilation.compiler.outputPath, file), 0o755);
    }
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.afterEmit.tap('MakeExecutablePlugin', (compilation) => this.makeExecutable(compilation));
  }
}