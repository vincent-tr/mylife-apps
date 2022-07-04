import fs from 'fs';
import path from 'path';
import { webpack, prepare, createServerConfig, createUiConfig, CopyPlugin } from 'mylife-tools-build/webpack.config';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

export default (env: Record<string, any>, argv: Record<string, any>) => {
  const { baseDirectory, dev } = prepare(env, argv);

  const uiConfig = createUiConfig(baseDirectory, dev);
  const serverConfig = createServerConfig(baseDirectory, dev);

  serverConfig.plugins = serverConfig.plugins || [];
  serverConfig.plugins.push(new CopyPlugin({
    patterns: [
      { from: ffmpegStatic, to: 'ffmpeg' },
      { from: ffprobeStatic.path, to: 'ffmpeg' },
    ],
  }));

  serverConfig.plugins.push(new MakeExecutablePlugin({ files: [
    'ffmpeg/ffmpeg',
    'ffmpeg/ffprobe',
  ] }));

  return [
    uiConfig,
    serverConfig,
  ];
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