'use strict';

const path = require('path');
const fs = require('fs-extra');
const { getConfig, createLogger } = require('mylife-tools-server');
const business = require('../business');

const logger = createLogger('mylife:gallery:web:content-routes');

exports.webApiFactory = ({ app, express, asyncHandler }) => {
  const router = express.Router();

  router.route('/image/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = business.documentGet('image', id);
    const fullPath = getFullPath(document);
    logger.debug(`Sending document '${id}' (fullPath='${fullPath}')`);

    const source = await fs.readFile(fullPath);
    const rotated = await business.imageRotateIfNeeded(source);
    const target = await business.imageToWebP(rotated);

    res.contentType('image/webp');
    res.send(target);
  }));

  router.route('/video/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = business.documentGet('video', id);
    const fullPath = getFullPath(document);
    logger.debug(`Sending document '${id}' (fullPath='${fullPath}')`);
    res.contentType('video/webm');
    business.videoToWebMStream(fullPath, res);
  }));

  router.route('/thumbnail/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const content = await business.thumbnailGet(id);
    logger.debug(`Sending thumbnail '${id}'`);
    res.contentType('image/png');
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
