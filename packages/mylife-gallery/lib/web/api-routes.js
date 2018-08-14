'use strict';

const express = require('express');

module.exports = (repository) => {
  const router = express.Router();

  router.route('/albums').get((req, res) => {
    res.json(repository.albums());
  });

  router.route('/album/:name').get((req, res) => {
    let { name } = req.params;
    name = name === '<unset>' ? undefined : name;
    const items = repository.album(name);
    res.json(items.map(item => {
      const { id, metadata } = item;
      return { id, ... metadata };
    }));
  });

  return router;
};
