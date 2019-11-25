'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const { createLogger } = require('mylife-tools-server');
const business = require('../../business');

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

const logger = createLogger('mylife:gallery:sync:loaders:video');

exports.processVideo = async (content, documentValues) => {
  const fsh = new FsHelper();
  await fsh.init();
  try {
    const contentFile = await fsh.toFile(content);
    // do not catch here, video metadata are mandatory for thumbnails
    await extractMetadata(contentFile, documentValues);

    // set date if found in metadata
    if(documentValues.metadata.date) {
      documentValues.date = documentValues.metadata.date;
    }

    await createThumbnails(fsh, contentFile, documentValues);

    logger.debug(`Video loaded '${getPath(documentValues)}'`);

  } finally {
    await fsh.terminate();
  }
};

function getPath(documentValues) {
  return documentValues.paths[0].path;
}

async function extractMetadata(fullPath, documentValues) {
  documentValues.metadata = {};

  const meta = await getRawMetadata(fullPath);

  const videoStream = meta.streams.find(stream => stream.codec_type === 'video');
  documentValues.duration = meta.format.duration;
  documentValues.height = videoStream.height;
  documentValues.width = videoStream.width;
  const creationDate = (meta.format.tags && meta.format.tags.creation_time) || null;
  documentValues.metadata.date = creationDate;
}

async function getRawMetadata(fullPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(fullPath, (err, metadata) => (err ? reject(err) : resolve(metadata)));
  });
}

async function createThumbnails(fsh, contentPath, documentValues) {
  const names = await createRawThumbnails(fsh.baseDirectory, contentPath, documentValues);
  documentValues.thumbnails = [];
  for(const name of names) {
    const thumbnailContent = await fsh.fromFileRelative(name);
    const thumbnail = await business.thumbnailCreate(thumbnailContent);
    documentValues.thumbnails.push(thumbnail);
  }
}

async function createRawThumbnails(baseDirectory, fullPath, { duration, height, width }) {

  const timestamps = [];
  if(duration < 25) {
    // every 5 secs
    for(let current = 0; current < duration; current += 5) {
      timestamps.push(current);
    }
  } else {
    // take 5 thumbnails
    for(let i=0; i<5; ++i) {
      timestamps.push(i * duration / 5);
    }
  }

  // scale to fit 200x200
  const size = width > height ? '200x?' : '?x200';

  let filenames;

  const command = ffmpeg(fullPath);
  command.thumbnails({ folder: baseDirectory, filename: '%b-thumbnail-%i', timestamps, size });
  command.on('filenames', value => (filenames = value));

  await new Promise((resolve, reject) => {
    command.on('end', resolve);
    command.on('error', reject);
  });

  return filenames;
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
