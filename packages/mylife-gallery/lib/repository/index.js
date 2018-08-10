'use strict';

const Database = require('./database');
const { load } = require('./loader');

exports.createRepository = function() {
  return new Database();
};

exports.loadRepository = async function({ directory }, repository) {
  await load(directory, repository);
};