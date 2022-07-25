import path from 'path';
import { getConfig, createLogger } from 'mylife-tools-server';
import * as business from '../business';

const logger = createLogger('mylife:gallery:web:content-routes');

export function webApiFactory({ app, express, asyncHandler }) {
  const router = express.Router();

  router.route('/image/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = business.documentGet('image', id);
    logger.debug(`Sending image '${id}'`);

    const stream = business.mediaGet(document.media.id, 'image');
    prepareResponse(res, 'image/webp');
    stream.pipe(res);
    stream.on('error', err => logger.error(`Error sending image '${id}' : ${err.stack}`));
  }));

  router.route('/video/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = business.documentGet('video', id);
    logger.debug(`Sending video '${id}'`);

    const stream = business.mediaGet(document.media.id, 'video');
    prepareResponse(res, 'video/webm');
    stream.pipe(res);
    stream.on('error', err => logger.error(`Error sending video '${id}' : ${err.stack}`));
  }));

  router.route('/thumbnail/:id').get(asyncHandler(async (req, res) => {
    const { id } = req.params;
    const content = await business.thumbnailGet(id);
    logger.debug(`Sending thumbnail '${id}'`);

    prepareResponse(res, 'image/webp');
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
}

function getFullPath(document) {
  if(document.paths.length === 0) {
    throw new Error(`Cannot get full path of document '${document._entity}:${document._id}' because it has no path`);
  }

  const basePath = getConfig<string>('gallery');
  const relativePath = document.paths[0].path;
  return path.join(basePath, relativePath);
}

function prepareResponse(response, contenType) {
  response.set('Content-Type', contenType);
  response.set('Cache-Control', 'public, max-age=31557600, s-maxage=31557600'); // 1 year
}
