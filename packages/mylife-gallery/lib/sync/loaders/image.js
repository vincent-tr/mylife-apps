'use strict';

const MemoryStream = require('memorystream');
const { createLogger } = require('mylife-tools-server');
const business = require('../../business');

const logger = createLogger('mylife:gallery:sync:loaders:image');

exports.processImage = async (content, relativePath) => {

  const values = {};
  try {
    values.metadata = business.imageLoadMetadata(content);
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
  const { thumbnailContent, ...otherValues } = await business.imageLoad(content);
  const thumbnailWebp = await business.imageToWebP(thumbnailContent);
  const thumbnail = await business.thumbnailCreate(thumbnailWebp);

  const rotated = await business.imageRotateIfNeeded(content);
  const target = await business.imageToWebP(rotated);
  const mediaId = await business.mediaCreate(new MemoryStream(target), 'image/webp');
  const media = { id: mediaId, size: target.length };

  Object.assign(values, { thumbnail, media, ...otherValues });

  logger.debug(`Image loaded '${relativePath}'`);
  return values;
};
