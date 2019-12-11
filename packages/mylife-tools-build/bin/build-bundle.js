#!/usr/bin/env node

'use strict';

const path = require('path');
const { buildWeb } = require('../lib/build-web');

main();

async function main() {

  const baseDirectory = process.cwd();
  const { mylifeBuild: config } = require(path.join(baseDirectory, 'package.json'));

  if(!config) {
    return;
  }

  if(config.web) {
    const result = await buildWeb(baseDirectory);
    if(!result) {
      process.exit(-1);
    }
  }
}
