'use strict';

const Database = require('./database');
const { load } = require('./loader');

exports.createRepository = function() {
  return new Database();
};

exports.loadRepository = async function({ gallery }, repository) {
  await load(gallery, repository);
};