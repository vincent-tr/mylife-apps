// MONGO_URL=mongodb://localhost/mylife-gallery GALLERY_PATH=~/gallery-data/ MEDIA_PATH=~/gallery-media/ npx ts-node --esm --transpileOnly --project ../mylife-tools-build/webpack.config/server/tsconfig.json bin/move-to-fs.js --config=conf/config.json

'use strict';

const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream').promises;
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
  const basePath = getConfig('media');
  const documents = business.documentFilter(document => document._entity === 'image' || document._entity === 'video');

  const types = {
    image: 'webp',
    video: 'webm'
  };

  const bucket = getService('database').gridFSBucket('media');
  const newObjectID = (id) =>  getService('database').newObjectID(id);

  for (const document of documents) {
    const relativePath = document.paths[0].path;
    console.log(`${++count} / ${documents.length} processing ${relativePath}`);

    const ext = types[document._entity];
    const id = document.media.id;

    const result = await bucket.find({ _id : newObjectID(id) });
    if ((await result.toArray()).length === 0) {
      console.log('skipped');
      continue;
    }

    const source = bucket.openDownloadStream(newObjectID(id)); // mediaGet
    const tempName = path.join(basePath, 'moving.tmp');

    const dest = fs.createWriteStream(tempName);

    await pipeline(source, dest);

    fs.renameSync(tempName, path.join(basePath, `${id}.${ext}`));
    await bucket.delete(newObjectID(id)); // mediaRemove
    console.log('done');
  }
}

