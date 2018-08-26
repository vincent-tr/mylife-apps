'use strict';

const express = require('express');
const LRU     = require('lru-cache');
const fs      = require('fs').promises;

const debug = require('debug')('mylife:gallery:web:image-routes');

module.exports = (options, repository) => {
  const router = express.Router();

  const rawCache = LRU({ max : options.rawCacheSize, length : cachenEntryLength });
  const thumbnailCache = LRU({ max : options.thumbnailCacheSize, length : cachenEntryLength });

  router.route('/raw/:id').get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { file } = repository.get(id);
      await sendImage(res, rawCache, id, file.path, file.mime);
    } catch(err) {
      next(err);
    }
  });

  router.route('/thumbnail/:id').get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { file } = repository.get(id);
      await sendImage(res, thumbnailCache, id, file.thumbnail, 'image/png');
    } catch(err) {
      next(err);
    }
  });

  return router;
};

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