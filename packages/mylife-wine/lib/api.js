'use strict';

const { ObjectID } = require('mongodb');
const express      = require('express');
const crud         = require('./api-crud');
const stock        = require('./api-stock');

function formatArticle(article) {
  article.type = new ObjectID(article.type);
  article.region = new ObjectID(article.region);
  article.dishes = article.dishes || [];
  for(let i=0; i<article.dishes.length; ++i) {
    article.dishes[i] = new ObjectID(article.dishes[i]);
  }
  return article;
}

module.exports = () => {
  const router = express.Router();

  crud.create(router, 'dish',     'dishes',     (id) => [{ store : 'article', find : { dishes   : id }}]);
  crud.create(router, 'region',   'regions',    (id) => [{ store : 'article', find : { region   : id }}]);
  crud.create(router, 'type',     'types',      (id) => [{ store : 'article', find : { type     : id }}]);
  crud.create(router, 'capacity', 'capacities', (id) => [{ store : 'history', find : { article  : id }}, { store : 'stock', find : { article : id }}]);
  crud.create(router, 'article',  'articles',   (id) => [{ store : 'history', find : { article  : id }}, { store : 'stock', find : { article : id }}], formatArticle);

  stock.create(router);

  return router;
};
