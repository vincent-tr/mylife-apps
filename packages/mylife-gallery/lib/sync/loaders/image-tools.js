'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const jimp = require('jimp');
const cwebp = require('webp-converter/cwebp');
const child_process = require('child_process');
const exifParser = require('exif-parser');

require('./tools/jimp-fix-rotate');

const converterPath = cwebp();

exports.imageLoad = async function(content) {
  const image = await jimp.read(content);

  const perceptualHash = image.hash();
  const mime = image.getMIME();
  const { width, height } = image.bitmap;

  const thumbnailContent = await image.scaleToFit(200, 200).getBufferAsync(jimp.MIME_PNG);

  return { perceptualHash, mime, thumbnailContent, width, height };
};

exports.imageRotateIfNeeded = async function(content) {
  // jpeg rotation if needed
  const image = await jimp.read(content);
  return await image.getBufferAsync(jimp.MIME_PNG);
};

exports.imageToWebP = async function(source) {
  const fsh = new FsHelper();
  await fsh.init();
  try {
    await fsh.input(source);
    const { input, output } = fsh.fileNames();
    await callWebpConverter('-q', '80', input, '-o', output);
    return await fsh.output();
  } finally {
    await fsh.terminate();
  }
};

async function callWebpConverter(...args) {
  return new Promise((resolve, reject) => {
    child_process.execFile(converterPath, args, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

class FsHelper {
  async init() {
    this.counter = 0;
    this.baseDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'webp-'));
  }

  async terminate() {
    await fs.remove(this.baseDirectory);
  }

  async input(content) {
    const fullPath = path.join(this.baseDirectory, 'input');
    await fs.writeFile(fullPath, content);
    return fullPath;
  }

  async output() {
    const fullPath = path.join(this.baseDirectory, 'output');
    return fs.readFile(fullPath);
  }

  fileNames() {
    return {
      input: path.join(this.baseDirectory, 'input'),
      output: path.join(this.baseDirectory, 'output')
    };
  }
}

exports.imageLoadMetadata = function (content) {
  const parser = exifParser.create(content);
  const { tags } = parser.parse();
  const model = tags.Model;
  const date = formatExifDate(tags.DateTimeOriginal) || formatExifDate(tags.CreateDate) || formatExifDate(tags.ModifyDate);
  const gps = formatExifGPS(tags);

  const metadata = { model, date };
  if(gps) {
    metadata.gpsLatitude = gps.latitude;
    metadata.gpsLongitude = gps.longitude;
  }

  return metadata;
};

function formatExifDate(value) {
  if(value < 0) {
    // got -2211753600 for null values
    // consider all pre-epoch as nulls
    return null;
  }
  return new Date(value * 1000);
}

function formatExifGPS(tags) {
  let { GPSLatitude: latitude, GPSLongitude: longitude } = tags;
  const { GPSLatitudeRef, GPSLongitudeRef } = tags;

  if(!latitude || !longitude) {
    return;
  }

  if(GPSLatitudeRef === 'S') {
    latitude *= -1;
  }
  if(GPSLongitudeRef === 'W') {
    longitude *= -1;
  }

  return { latitude, longitude };
}
