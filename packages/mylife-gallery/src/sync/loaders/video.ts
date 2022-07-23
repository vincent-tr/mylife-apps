import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { PassThrough } from 'stream';

import { createLogger } from 'mylife-tools-server';
import * as business from '../../business';
import { getMetadata, createThumbnails, toWebMStream } from './tools/ffmpeg';

const logger = createLogger('mylife:gallery:sync:loaders:video');

type FIXME_any = any;

export async function processVideo(content, relativePath) {
  const fsh = new FsHelper();
  await fsh.init();
  try {
    const contentFile = await fsh.toFile(content);
    // do not catch here, video metadata are mandatory for thumbnails
    const values = await extractMetadata(contentFile);

    // set date if found in metadata
    if (values.metadata.date) {
      values.date = values.metadata.date;
    }

    await createThumbnailsValues(fsh, contentFile, values);

    const stream = new PassThrough();
    await toWebMStream(contentFile, stream);
    values.media = await business.mediaCreate(stream, 'video/webm');

    logger.debug(`Video loaded '${relativePath}'`);
    return values;
  } finally {
    await fsh.terminate();
  }
}

async function extractMetadata(fullPath) {
  const values: FIXME_any = {
    metadata: {},
  };

  const meta: FIXME_any = await getMetadata(fullPath);

  const videoStream = meta.streams.find((stream) => stream.codec_type === 'video');
  values.duration = meta.format.duration;
  values.height = videoStream.height;
  values.width = videoStream.width;
  const creationDate = (meta.format.tags && meta.format.tags.creation_time) || null;
  values.metadata.date = parseDate(creationDate);

  return values;
}

function parseDate(date) {
  if (!date) {
    return null;
  }

  return Date.parse(date);
}

async function createThumbnailsValues(fsh, contentPath, values) {
  const { duration, height, width } = values;
  const timestamps = computeTimeStamps(duration);
  const names = await createThumbnails(fsh.baseDirectory, contentPath, { timestamps, height, width });
  const thumbnailContents: Buffer[] = [];
  // first read all thumbnails, then create all: in case there is a read error (=> thumbnails creation error), nothing is created
  for (const name of names) {
    thumbnailContents.push(await fsh.fromFileRelative(name));
  }

  values.thumbnails = [];
  for (const thumbnailContent of thumbnailContents) {
    const thumbnail = await business.thumbnailCreate(thumbnailContent);
    values.thumbnails.push(thumbnail);
  }
}

function computeTimeStamps(duration) {
  const timestamps: number[] = [];
  if (duration < 25) {
    // every 5 secs
    for (let current = 0; current < duration; current += 5) {
      timestamps.push(current);
    }
  } else {
    // take 5 thumbnails
    for (let i = 0; i < 5; ++i) {
      timestamps.push((i * duration) / 5);
    }
  }

  return timestamps;
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
    return names.map((name) => path.join(this.baseDirectory, name));
  }

  async fromFile(fullPath) {
    return fs.readFile(fullPath);
  }

  async fromFileRelative(relativePath) {
    return fs.readFile(path.join(this.baseDirectory, relativePath));
  }
}
