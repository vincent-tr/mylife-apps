'use strict';

const express = require('express');
const crud    = require('./api-crud');
const stock   = require('./api-stock');

module.exports = () => {
  const router = express.Router();

  crud.create(router, 'dish',     'dishes',     (id) => [{ store : 'article', find : { dishes   : id }}]);
  crud.create(router, 'region',   'regions',    (id) => [{ store : 'article', find : { region   : id }}]);
  crud.create(router, 'type',     'types',      (id) => [{ store : 'article', find : { type     : id }}]);
  crud.create(router, 'capacity', 'capacities', (id) => [{ store : 'history', find : { article  : id }}, { store : 'stock', find : { article : id }}]);
  crud.create(router, 'article',  'articles',   (id) => [{ store : 'history', find : { article  : id }}, { store : 'stock', find : { article : id }}]);

  stock.create(router);

  return router;
};
