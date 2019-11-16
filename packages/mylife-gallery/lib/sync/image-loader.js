'use strict';

const fs    = require('fs').promises;
const jimp = require('jimp');
const exifParser = require('exif-parser');
const { createLogger } = require('mylife-tools-server');

const logger = createLogger('mylife:gallery:sync:image-loader');

exports.load = async function load(fullPath) {

  logger.debug(`Loading file '${fullPath}'`);
  try {

    const metadata = {};

    const content = await fs.readFile(fullPath);

    try {
      const parser = exifParser.create(content);
      const { tags } = parser.parse();
      metadata.from = tags.Model;
      metadata.date = formatDate(tags.DateTimeOriginal || tags.CreateDate || tags.ModifyDate);
      metadata.gps = formatGPS(tags);
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

function formatDate(value) {
  return new Date(value * 1000);
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

  let latitude = /*timeToDec*/(GPSLatitude);
  if(GPSLatitudeRef === 'W') {
    latitude *= -1;
  }

  let longitude = /*timeToDec*/(GPSLongitude);
  if(GPSLongitudeRef === 'W') {
    longitude *= -1;
  }

  return { latitude, longitude };
}
