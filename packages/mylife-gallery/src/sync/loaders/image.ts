import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { PassThrough } from 'stream';

import { createLogger } from 'mylife-tools-server';
import * as business from '../../business';
import { Image } from './tools/jimp';
import { getMetadata } from './tools/exif';
import { toWebPStream } from './tools/ffmpeg';

const logger = createLogger('mylife:gallery:sync:loaders:image');

type FIXME_any = any;

export async function processImage(content, relativePath) {

  const values: FIXME_any = {};
  try {
    values.metadata = getMetadata(content);
  } catch(err) {
    // this is not a fatal error, we can keep going without metadata
    logger.error(`Error loading image metadata '${relativePath}': ${err.stack}`);
    values.metadata = {};
  }

  // set date if found in metadata
  if(values.metadata.date) {
    values.date = values.metadata.date;
  }

  // do not try/catch if we could not read the image
  const image = await Image.load(content);

  const fsh = new FsHelper();
  await fsh.init();
  try {
    const thBuffFile = await fsh.toFile(await image.thumbnailPngBuffer());

    const thStream = new PassThrough();
    await toWebPStream(thBuffFile, thStream);

    const chunks: Buffer[] = [];
    for await (let chunk of thStream) {
      chunks.push(chunk);
    }
    const thumbnailContent = Buffer.concat(chunks);
    //---

    const thumbnail = await business.thumbnailCreate(thumbnailContent);

    // from image to keep proper rotation
    const buffFile = await fsh.toFile(await image.pngBuffer());
    const imageStream = new PassThrough();
    await toWebPStream(buffFile, imageStream);
    //---
    const media = await business.mediaCreate(imageStream, 'image/webp');

    const metadata = image.getMetadata();
    Object.assign(values, { thumbnail, media, ...metadata });

    logger.debug(`Image loaded '${relativePath}'`);
    return values;

  } finally {
    await fsh.terminate();
  }
}

// TODO: share
class FsHelper {
  private counter;
  private baseDirectory;

  async init() {
    this.counter = 0;
    this.baseDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'ffmpeg-'));
  }

  async terminate() {
    await fs.remove(this.baseDirectory);
  }

  async toFile(content) {
    const fullPath = path.join(this.baseDirectory, `content-${++this.counter}`);
    await fs.writeFile(fullPath, content);
    return fullPath;
  }

  async list() {
    const names = await fs.readdir(this.baseDirectory);
    return names.map(name => path.join(this.baseDirectory, name));
  }

  async fromFile(fullPath) {
    return fs.readFile(fullPath);
  }

  async fromFileRelative(relativePath) {
    return fs.readFile(path.join(this.baseDirectory, relativePath));
  }
}
