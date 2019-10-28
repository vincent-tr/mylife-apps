#!/usr/bin/env node

'use strict';

require('../lib/init');
const fetch = require('node-fetch');
const { createLogger, getArg, runTask, getStoreCollection } = require('mylife-tools-server');
const metadataDefintions = require('../lib/metadata');
const storeConfiguration = require('../lib/store-configuration');

const logger = createLogger('mylife:portal:update-image');

runTask({ services: ['store'], metadataDefintions, storeConfiguration, task: async () => {
  const url = getArg('url');
  const code = getArg('code');

  if(!url || !code) {
    console.log('Usage: bin/update-image.js --url=<image-url> --code=<item-code>'); // eslint-disable-line no-console
    return;
  }

  const items = getStoreCollection('items');
  const existingItem = items.list().find(item => item.code === code);
  if(!existingItem) {
    console.error(`Item with code '${code}' not found`);
  }

  const res = await fetch(url);
  const icon = await res.buffer();
  const iconMime = res.headers.get('content-type');

  const item = items.entity.setValues(existingItem, { icon, iconMime });
  items.set(item);

  console.log(`Image set on item ${code}`);
}});
