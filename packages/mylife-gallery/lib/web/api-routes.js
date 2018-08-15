'use strict';

const express = require('express');

module.exports = (repository) => {
  const router = express.Router();

  router.route('/albums').get((req, res) => {
    const names = repository.albums();
    res.json(names.map(name => ({ name, first : repository.album(name)[0].id })));
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
