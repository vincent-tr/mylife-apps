'use strict';

const express = require('express');

module.exports = (repository) => {
  const router = express.Router();

  router.route('/raw/:id').get((req, res) => {
    const { id } = req.params;
    const { content, mime } = repository.get(id);
    res.contentType(mime);
    res.send(content);
  });

  router.route('/thumbnail/:id').get(function(req, res) {
    const { id } = req.params;
    const { thumbnail } = repository.get(id);
    res.contentType('image/png');
    res.send(thumbnail);
  });

  return router;
};

