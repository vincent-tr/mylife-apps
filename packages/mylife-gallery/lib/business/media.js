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

    stream.addEventListener('error', onError);
    stream.addEventListener('file', onSuccess);

    function removeListeners() {
      stream.removeEventListener('error', onError);
      stream.removeEventListener('file', onSuccess);
    }
  });
}
