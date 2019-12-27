'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const MemoryStream = require('memorystream');

const { createLogger } = require('mylife-tools-server');
const business = require('../../business');
const tools = require('./video-tools');

const logger = createLogger('mylife:gallery:sync:loaders:video');

exports.processVideo = async (content, relativePath) => {
  const fsh = new FsHelper();
  await fsh.init();
  try {
    const contentFile = await fsh.toFile(content);
    // do not catch here, video metadata are mandatory for thumbnails
    const values = await extractMetadata(contentFile);

    // set date if found in metadata
    if(values.metadata.date) {
      values.date = values.metadata.date;
    }

    await createThumbnails(fsh, contentFile, values);

    const ms = new MemoryStream();
    tools.videoToWebMStream(contentFile, ms);
    const mediaId = await business.mediaCreate(ms, 'video/webm');
    values.media = { id: mediaId, size: 0 }; // TODO size

    logger.debug(`Video loaded '${relativePath}'`);
    return values;

  } finally {
    await fsh.terminate();
  }
};

async function extractMetadata(fullPath) {
  const values = {
    metadata: {}
  };

  const meta = await tools.videoGetMetadata(fullPath);

  const videoStream = meta.streams.find(stream => stream.codec_type === 'video');
  values.duration = meta.format.duration;
  values.height = videoStream.height;
  values.width = videoStream.width;
  const creationDate = (meta.format.tags && meta.format.tags.creation_time) || null;
  values.metadata.date = creationDate;

  return values;
}

async function createThumbnails(fsh, contentPath, values) {

  const { duration, height, width } = values;
  const timestamps = computeTimeStamps(duration);
  const names = await tools.videoCreateThumbnails(fsh.baseDirectory, contentPath, { timestamps, height, width });
  const thumbnailContents = [];
  // first read all thumbnails, then create all: in case there is a read error (=> thumbnails creation error), nothing is created
  for(const name of names) {
    thumbnailContents.push(await fsh.fromFileRelative(name));
  }

  values.thumbnails = [];
  for(const thumbnailContent of thumbnailContents) {
    const thumbnailWebp = await tools.imageToWebP(thumbnailContent);
    const thumbnail = await business.thumbnailCreate(thumbnailWebp);
    values.thumbnails.push(thumbnail);
  }
}

function computeTimeStamps(duration) {
  const timestamps = [];
  // seems that if duration is eg 5.001 we cannot take a screenshot a 5
  const floorDuration = Math.floor(duration);
  if(floorDuration < 25) {
    // every 5 secs
    for(let current = 0; current < floorDuration; current += 5) {
      timestamps.push(current);
    }
  } else {
    // take 5 thumbnails
    for(let i=0; i<5; ++i) {
      timestamps.push(i * floorDuration / 5);
    }
  }

  return timestamps;
}

class FsHelper {
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
