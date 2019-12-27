'use strict';

const { createLogger } = require('mylife-tools-server');
const business = require('../../business');
const { Image } = require('./tools/jimp');
const { getMetadata } = require('./tools/exif');
const { convertBufferToWebpBuffer, convertBufferToWebpStream } = require('./tools/webp');

const logger = createLogger('mylife:gallery:sync:loaders:image');

exports.processImage = async (content, relativePath) => {

  const values = {};
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

  const thumbnailContent = await convertBufferToWebpBuffer(await image.thumbnailPngBuffer());
  const thumbnail = await business.thumbnailCreate(thumbnailContent);

  // from image to keep proper rotation
  const imageStream = await convertBufferToWebpStream(await image.pngBuffer());
  const mediaId = await business.mediaCreate(imageStream, 'image/webp');
  const media = { id: mediaId, size: 0 }; // TODO size

  const metadata = image.getMetadata();
  Object.assign(values, { thumbnail, media, ...metadata });

  logger.debug(`Image loaded '${relativePath}'`);
  return values;
};
