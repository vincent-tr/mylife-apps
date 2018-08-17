'use strict';

const fs      = require('fs');
const path    = require('path');
const express = require('express');

const routes = [ '/', '/album/:albumName', '/image/:albumName/:imageId' ];
const file = fs.readFileSync(path.join(__dirname, '../../public/index.html'));

const handler = (req, res) => res.contentType('text/html').send(file).end();

module.exports = () => {
  const router = express.Router();

  for(const route of routes) {
    router.get(route, handler);
  }

  return router;
};
