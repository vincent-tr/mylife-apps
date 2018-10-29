'use strict';

const { run } = require('../lib/sync');
const { close } = require('../lib/repository');

async function start() {
  try {
    await run();
  } catch(err) {
    console.error(err); // eslint-disable-line no-console
  } finally {
    await close();
  }
}

start();
