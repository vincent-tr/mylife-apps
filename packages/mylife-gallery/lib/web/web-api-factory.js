'use strict';

const path = require('path');
const { getConfig, createLogger } = require('mylife-tools-server');
const business = require('../business');

const logger = createLogger('mylife:gallery:web:content-routes');

exports.webApiFactory = ({ app, express, asyncHandler }) => {
  const router = express.Router();

  router.route('/image/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = business.documentGet('image', id);
    logger.debug(`Sending image '${id}'`);

    const stream = business.mediaGet(document.media.id);
    res.contentType('image/webp');
    stream.pipe(res);
    stream.on('error', err => logger.error(`Error sending image '${id}' : ${err.stack}`));
  }));

  router.route('/video/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = business.documentGet('video', id);
    logger.debug(`Sending video '${id}'`);

    const stream = business.mediaGet(document.media.id);
    res.contentType('video/webm');
    stream.pipe(res);
    stream.on('error', err => logger.error(`Error sending video '${id}' : ${err.stack}`));
  }));

  router.route('/thumbnail/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const content = await business.thumbnailGet(id);
    logger.debug(`Sending thumbnail '${id}'`);

    res.contentType('image/webp');
    res.send(content);
  }));

  router.route('/raw/:type/:id').get(asyncHandler(async (req, res) => {
    const { type, id } = req.params;
    const document = business.documentGet(type, id);

    const fullPath = getFullPath(document);
    logger.debug(`Sending document '${id}' (fullPath='${fullPath}')`);
    res.sendFile(fullPath);
  }));

  app.use('/content', router);
};

function getFullPath(document) {
  const basePath = getConfig('gallery');
  const relativePath = document.paths[0].path;
  return path.join(basePath, relativePath);
}
