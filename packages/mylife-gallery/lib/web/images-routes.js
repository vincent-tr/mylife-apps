'use strict';

const path                   = require('path');
const fs                     = require('fs').promises;
const express                = require('express');
const asyncHandler           = require('express-async-handler');
const LRU                    = require('lru-cache');
const config                 = require('../config');
const { images, thumbnails, unwrapBinary } = require('../repository');

const debug = require('debug')('mylife:gallery:web:image-routes');

module.exports = () => {
  const router = express.Router();

  //const rawCache = LRU({ max : config.rawCacheSize, length : cachenEntryLength });
  //const thumbnailCache = LRU({ max : config.thumbnailCacheSize, length : cachenEntryLength });

  router.route('/raw/:iid').get(asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const { ipath, mime } = await images.getByIId(iid);
    res.contentType(mime);
    res.sendFile(path.join(config.gallery, ipath));
  }));

  router.route('/thumbnail/:iid').get(asyncHandler(async (req, res) => {
    const { iid } = req.params;
    const { content } = await thumbnails.getByIId(iid);
    res.contentType('image/png');
    res.send(unwrapBinary(content));
  }));

  return router;
};
/*
async function sendImage(res, cache, id, path, mime) {
  let content = cache.get(id);
  if(!content) {
    debug(`Loading image file '${path}'`);
    content = await fs.readFile(path);
    cache.set(id, content);
  }

  res.contentType(mime);
  res.send(content);
}

function cachenEntryLength(item) {
  return item.length;
}
*/
