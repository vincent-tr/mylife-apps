#!/usr/bin/env node

'use strict';

const { buildWeb } = require('../lib/build-web');

main();

async function main() {

  const baseDirectory = process.cwd();
  const result = await buildWeb(baseDirectory);
  if(!result) {
    process.exit(-1);
  }
}
