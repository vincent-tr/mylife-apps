'use strict';

const fs    = require('fs').promises;
const jimp = require('jimp');
const ExifImage = require('exif').ExifImage;
const { createLogger } = require('mylife-tools-server');

const logger = createLogger('mylife:gallery:sync:image-loader');

exports.load = async function load(fullPath) {

  logger.debug(`Loading file '${fullPath}'`);
  try {

    const metadata = {};

    const content = await fs.readFile(fullPath);

    try {
      const { image, exif, gps } = await runExif(content);
      metadata.from = image.Model;
      metadata.date = exif.DateTimeOriginal || exif.CreateDate || exif.ModifyDate;
      metadata.gps = formatGPS(gps);
    } catch(err) {
      logger.error(`Error loading image metadata '${fullPath}': ${err.stack}`);
    }

    const image = await jimp.read(content);
    const iid = image.hash();
    const mime = image.getMIME();

    const thumbnail = await image.scaleToFit(200, 200).getBufferAsync(jimp.MIME_PNG);

    logger.debug(`File loaded (iid=${iid})`);

    return { metadata, iid, mime, thumbnail };

  } catch(err) {
    logger.error(`Error loading image '${fullPath}': ${err.stack}`);
  }
};

async function runExif(...args) {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage(...args, (err, data) => (err ? reject(err) : resolve(data)));
    } catch(err) {
      reject(err);
    }
  });
}

function formatGPS(gps) {
  if(!gps) {
    return;
  }

  const {
    GPSLatitude,
    GPSLatitudeRef,
    GPSLongitude,
    GPSLongitudeRef,
  } = gps;

  if(!GPSLatitude || !GPSLongitude) {
    return;
  }

  let latitude = timeToDec(GPSLatitude);
  if(GPSLatitudeRef === 'W') {
    latitude *= -1;
  }

  let longitude = timeToDec(GPSLongitude);
  if(GPSLongitudeRef === 'W') {
    longitude *= -1;
  }

  return { latitude, longitude };
}

function timeToDec([ h, m, s ]) {
  return h + m / 60 + s / 3600;
}
