'use strict';

const fs      = require('fs');
const path    = require('path');
const express = require('express');

const file = fs.readFileSync(path.join(__dirname, '../../public/index.html'));

const handler = (req, res) => res.contentType('text/html').send(file).end();

module.exports = () => {
  const router = express.Router();

  router.get('/', handler);
  router.get(/\/path(.*)/, handler);

  return router;
};
