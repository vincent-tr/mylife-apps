'use strict';

const express = require('express');

module.exports = (repository) => {
  const router = express.Router();

  router.route('/root').get((req, res) => {
    const items = repository.list();
    res.json(items.map(item => {
      const { id, metadata } = item;
      return { id, ... metadata };
    }));
  });

  return router;
};

