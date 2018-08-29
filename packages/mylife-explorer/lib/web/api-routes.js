'use strict';

const express = require('express');

module.exports = (options) => {
  const router = express.Router();
/*
  router.route('metadata').get((req, res) => {

  });

  router.route('content').get((req, res) => {

  });
*/

/*
  router.route('/albums').get((req, res) => {
    const names = repository.albums();
    res.json(names.map(name => {
      const album = repository.album(name);
      return { name, first : album[0].id, count : album.length };
    }));
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
*/
  return router;
};
