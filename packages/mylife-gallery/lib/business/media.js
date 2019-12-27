'use strict';

const { createLogger, getService } = require('mylife-tools-server');
const logger = createLogger('mylife:gallery:business:media');

exports.mediaCreate = async (inputStream, contentType) => {
  const bucket = getBucket();
  const bucketStream = bucket.openUploadStream(null, { contentType });
  const id = bucketStream.id;

  logger.info(`Insert media (id: '${id}')`);
  await pipeAndWait(inputStream, bucketStream);
  return id;
};

exports.mediaRemove = async (id) => {
  const bucket = getBucket();

  logger.info(`Delete media (id: '${id}')`);
  await bucket.delete(id);
};

exports.mediaGet = async (id) => {
  // TODO
};

function getBucket() {
  return getService('database').gridFSBucket('media');
}

async function pipeAndWait(input, output) {
  input.pipe(output);

  return new Promise((resolve, reject) => {
    const end = (err) => {
      input.removeEventListener('error', end);
      output.removeEventListener('error', end);
      output.removeEventListener('finish', end);

      if(err) {
        reject(err);
      } else {
        resolve();
      }
    };

    input.addEventListener('error', end);
    output.addEventListener('error', end);
    output.addEventListener('finish', end);
  });
}
