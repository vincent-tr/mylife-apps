'use strict';

const express = require('express');
const vfs     = require('../vfs');

module.exports = (repository) => {
  const router = express.Router();

  router.route('/raw/:id').get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { content, mime } = repository.get(id);
      await sendImage(res, content, mime);
    } catch(err) {
      next(err);
    }
  });

  router.route('/thumbnail/:id').get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { thumbnail } = repository.get(id);
      await sendImage(res, thumbnail, 'image/png');
    } catch(err) {
      next(err);
    }
  });

  return router;
};

async function sendImage(res, path, mime) {
  const file = await vfs.FSEntry.load(path);
  const content = await file.content();
  res.contentType(mime);
  res.send(content);
}