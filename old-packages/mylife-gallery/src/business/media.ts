import fs from 'fs';
import path from 'path';
import { Transform, TransformCallback } from 'stream';
import { pipeline } from 'stream/promises';
import { createLogger, getService, getConfig } from 'mylife-tools-server';

const logger = createLogger('mylife:gallery:business:media');

const extensions = {
  image: 'webp',
  video: 'webm'
};

export type MediaType = 'image' | 'video';

export async function mediaCreate(inputStream: NodeJS.ReadableStream, type: MediaType) {
  // TODO: use temp files and delete partial file if operation fails, or move it as definitive file if the operation success
  const id = getService('database').newObjectID().toString();
  const fileName = getMediaPath(id, type);
  const fileStream = fs.createWriteStream(fileName);

  const counter = new StreamCounter();
  logger.info(`Insert media (id: '${id}')`);
  await pipeline(inputStream, counter, fileStream);
  return { id, size: counter.bytes };
}

class StreamCounter extends Transform {
  private _bytes = 0;

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    this._bytes += chunk.length;
    this.push(chunk);
    callback();
  }

  get bytes() {
    return this._bytes;
  }
}

export async function mediaRemove(id: string, type: MediaType) {
  const fileName = getMediaPath(id, type);

  logger.info(`Delete media (id: '${id}')`);
  await fs.promises.unlink(fileName);
}

export function mediaGet(id: string, type: MediaType) {
  return fs.createReadStream(getMediaPath(id, type));
}

function getMediaPath(id: string, type: MediaType) {
  const basePath = getConfig<string>('media');
  const ext = extensions[type];
  return path.join(basePath, `${id}.${ext}`);
}