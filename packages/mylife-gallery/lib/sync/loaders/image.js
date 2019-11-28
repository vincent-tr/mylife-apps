'use strict';

const jimp = require('jimp');
const exifParser = require('exif-parser');
const { createLogger } = require('mylife-tools-server');
const business = require('../../business');

const logger = createLogger('mylife:gallery:sync:loaders:image');

exports.processImage = async (content, relativePath) => {

  const values = {};
  try {
    values.metadata = loadMetadata(content);
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
  Object.assign(values, await loadImage(content));

  logger.debug(`Image loaded '${relativePath}'`);
  return values;
};

function loadMetadata(content) {
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
}

async function loadImage(content) {
  const image = await jimp.read(content);

  const perceptualHash = image.hash();
  const mime = image.getMIME();
  const { width, height } = image.bitmap;

  const thumbnailContent = await image.scaleToFit(200, 200).getBufferAsync(jimp.MIME_PNG);
  const thumbnail = await business.thumbnailCreate(thumbnailContent);

  return { perceptualHash, mime, thumbnail, width, height };
}

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
