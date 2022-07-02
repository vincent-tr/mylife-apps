#!/usr/bin/env node

'use strict';

const exifParser = require('exif-parser');
const fs = require('fs');
const path = require('path');
require('../src/init');
require('../src/index-service');
const { runTask, getConfig, getService } = require('mylife-tools-server');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../src/store-configuration');
require('../src/sync');

const business = require('../src/business');

const services = ['store', 'database', 'index-service'];
const parameters = { metadataDefintions, storeConfiguration };

runTask({ services, task, ... parameters });

async function task() {
  let count = 0;
  const basePath = getConfig('gallery');
  const documents = business.documentFilter(document => document._entity === 'image' && !document.date);
  const taskQueueManager = getService('task-queue-manager');
  const storeQueue = taskQueueManager.getQueue('store');

  for(const document of documents) {
    const relativePath = document.paths[0].path;
    console.log(`${++count} / ${documents.length} processing ${relativePath}`);

    if(document.metadata.date) {
      business.documentUpdate(document, { date: document.metadata.date });
      await storeQueue.waitEmpty();
      continue;
    }

    const filePath = path.join(basePath, relativePath);
    const date = safeLoad(filePath);
    if(!date) {
      continue;
    }

    const metadata = { ...document.metadata, date };
    business.documentUpdate(document, { metadata, date });

    await storeQueue.waitEmpty();
  }
}

function safeLoad(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const parser = exifParser.create(content);
    const { tags } = parser.parse();
    return formatExifDate(tags.DateTimeOriginal) || formatExifDate(tags.CreateDate) || formatExifDate(tags.ModifyDate);
  } catch(err) {
    return null;
  }
}

function formatExifDate(value) {
  if(typeof(value) !== 'number' || value <= 0) {
    // got -2211753600 for null values
    // consider all pre-epoch as nulls
    return null;
  }
  return new Date(value * 1000);
}