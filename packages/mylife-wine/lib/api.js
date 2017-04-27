'use strict';

//const { ObjectID } = require('mongodb');
//const monk         = require('monk');
//const config       = require('../conf/config');
//const coMonk       = require('co-monk');
//const co           = require('co');
const express      = require('express');
//const log4js       = require('log4js');
//const logger       = log4js.getLogger('mylife:wine:api');
const crud         = require('./crud');

//const db = monk(config.mongo);

module.exports = () => {
  const router = express.Router();

  crud.create(router, 'dish',     'dishes',     (id) => [{ store : 'article', find : { dishes   : id }}]);
  crud.create(router, 'region',   'regions',    (id) => [{ store : 'article', find : { region   : id }}]);
  crud.create(router, 'type',     'types',      (id) => [{ store : 'article', find : { type     : id }}]);
  crud.create(router, 'capacity', 'capacities', (id) => [{ store : 'history', find : { article  : id }}, { store : 'stock', find : { article : id }}]);
  crud.create(router, 'article',  'articles',   (id) => [{ store : 'history', find : { article  : id }}, { store : 'stock', find : { article : id }}]);

  return router;
};
