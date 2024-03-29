'use strict';

const { createLogger, getArg } = require('mylife-tools-server');
const business = require('../business');

const logger = createLogger('mylife:explorer:web:content-routes');

export function webApiFactory({ app, express, asyncHandler }) {
  const dev = getArg('dev');
  if(!dev) {
    return;
  }

  const router = express.Router();

  router.route(/(.*)/).get(asyncHandler(async (req, res) => {
    const path           = req.params[0];
    const { size, mime } = await business.getInfos(path);
    const { range }      = req.headers;

    logger.debug(`Sending file '${path}' (range=${range})`);

    if(range) {
      const parts     = range.replace(/bytes=/, '').split('-');
      const start     = parseInt(parts[0], 10);
      const end       = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = (end - start) + 1;
      const stream    = business.createReadStream(path, { start, end });
      const head = {
        'Content-Range'  : `bytes ${start}-${end}/${size}`,
        'Accept-Ranges'  : 'bytes',
        'Content-Length' : chunksize,
        'Content-Type'   : mime,
      };
      res.writeHead(206, head);
      stream.pipe(res);
    } else {
      const stream = business.createReadStream(path);
      const head = {
        'Content-Length' : size,
        'Content-Type'   : mime,
      };
      res.writeHead(200, head);
      stream.pipe(res);
    }
  }));

  app.use('/_content', router);
}
