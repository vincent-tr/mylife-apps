'use strict';

const express = require('express');

module.exports = (repository) => {
  const router = express.Router();

  router.route('/root').get((req, res) => {
    const items = repository.list();
    const keys = [ 'id', 'name' ];
    res.json(items.map(item => item.properties(keys)));
  });

  return router;
};

