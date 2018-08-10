'use strict';

const Database = require('./database');
const { load } = require('./loader');

exports.createRepository = async function({ directory }) {
  const database = new Database();
  await load(directory, database);
  return database;
};