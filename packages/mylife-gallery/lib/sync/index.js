'use strict';

const { run } = require('./album-sync');

exports.run = async function() {
  await run();
};