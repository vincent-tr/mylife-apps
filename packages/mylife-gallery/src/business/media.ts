import { createLogger, getService } from 'mylife-tools-server';

const logger = createLogger('mylife:gallery:business:media');

type FIXME_any = any;

export async function mediaCreate(inputStream, contentType) {
  const bucket = getBucket();
  const id = newObjectID().toString();
  const bucketStream = bucket.openUploadStreamWithId(newObjectID(id), null, { contentType });

  logger.info(`Insert media (id: '${id}')`);
  const { length } = await pipeAndWait(inputStream, bucketStream) as FIXME_any;
  return { id, size: length };
}

export async function mediaRemove(id) {
  const bucket = getBucket();

  logger.info(`Delete media (id: '${id}')`);
  await bucket.delete(newObjectID(id));
}

export function mediaGet(id) {
  const bucket = getBucket();
  return bucket.openDownloadStream(newObjectID(id));
}

function newObjectID(id?) {
  return getService('database').newObjectID(id);
}

function getBucket() {
  return getService('database').gridFSBucket('media');
}

async function pipeAndWait(input, output) {
  input.pipe(output);

  return new Promise((resolve, reject) => {
    const onSuccess = (data) => {
      removeListeners();
      resolve(data);
    };

    const onError = (err) => {
      removeListeners();
      reject(err);
    };

    input.addListener('error', onError);
    output.addListener('error', onError);
    output.addListener('finish', onSuccess);

    function removeListeners() {
      input.removeListener('error', onError);
      output.removeListener('error', onError);
      output.removeListener('finish', onSuccess);
    }
  });
}
