'use strict';

const MemoryStream = require('memorystream');
const { createLogger } = require('mylife-tools-server');
const business = require('../../business');
const tools = require('./image-tools');
const { Image } = require('./tools/jimp');
const { getMetadata } = require('./tools/exif');

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

  const thumbnailContent = await image.thumbnailPngBuffer();
  const thumbnailWebp = await tools.imageToWebP(thumbnailContent);
  const thumbnail = await business.thumbnailCreate(thumbnailWebp);

  const rotated = await image.pngBuffer();
  const target = await tools.imageToWebP(rotated);
  const mediaId = await business.mediaCreate(new MemoryStream(target), 'image/webp');
  const media = { id: mediaId, size: target.length };

  const metadata = image.getMetadata();
  Object.assign(values, { thumbnail, media, ...metadata });

  logger.debug(`Image loaded '${relativePath}'`);
  return values;
};
