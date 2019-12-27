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
  const bucket = getBucket();
  const stream = bucket.openDownloadStream(id);
  const { contentType, length } = await waitFile(stream);
  return { stream, contentType, length };
};

function getBucket() {
  return getService('database').gridFSBucket('media');
}

async function pipeAndWait(input, output) {
  input.pipe(output);

  return new Promise((resolve, reject) => {
    const end = (err) => {
      input.removeListener('error', end);
      output.removeListener('error', end);
      output.removeListener('finish', end);

      if(err) {
        reject(err);
      } else {
        resolve();
      }
    };

    input.addListener('error', end);
    output.addListener('error', end);
    output.addListener('finish', end);
  });
}

async function waitFile(stream) {
  return new Promise((resolve, reject) => {
    const onSuccess = (file) => {
      removeListeners();
      resolve(file);
    };

    const onError = (err) => {
      removeListeners();
      reject(err);
    };

    stream.addListener('error', onError);
    stream.addListener('file', onSuccess);

    function removeListeners() {
      stream.removeListener('error', onError);
      stream.removeListener('file', onSuccess);
    }
  });
}
