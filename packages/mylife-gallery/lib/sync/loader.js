'use strict';

const vfs = require('../vfs');
const jimp = require('jimp');
const ExifImage = require('exif').ExifImage;

const { Item } = require('../repository');

const debug = require('debug')('mylife:gallery:repository:loader');

const supportedExtensions = new Set([ '.jpg', '.jpeg', '.png' ]);

exports.load = async function({ gallery, cache }, database) {
  const directory = await vfs.FSEntry.load(gallery);
  const cacheBaseDirectory = await vfs.FSEntry.load(cache);
  const cacheDirectory = await cacheBaseDirectory.ensureDirectory('thumbnail');

  for(const item of await directory.list()) {
    if(!(item instanceof vfs.Directory)) {
      continue;
    }

    debug(`Loading directory ${item.path}`);

    const baseProps = {
      album : item.name
    };

    await loadDirectory(item, cacheDirectory, database, baseProps);
  }

  await loadDirectory(directory, cacheDirectory, database, {});
};

async function loadDirectory(directory, cacheDirectory, database, baseProps) {
  for(const item of await directory.list()) {
    const { name, ext } = item;
    if(!(item instanceof vfs.File) || !supportedExtensions.has(ext)) {
      continue;
    }

    debug(`Loading file ${item.path}`);

    const content = await item.content();

    const props = {
      ...baseProps,
      name,
      ext,
      content : item.fullPath
    };

    try {
      props.metadata = await exif(content);
    } catch(err) {
      console.error(err);
    }

    const image = await jimp.read(content);
    props.id = image.hash();
    props.mime = image.getMIME();

    const thumbnailContent = await image.scaleToFit(200, 200).getBufferAsync(jimp.MIME_PNG);
    const thumbnail = await cacheDirectory.writeFile(`${props.id}.png`, thumbnailContent);
    props.thumbnail = thumbnail.fullPath;

    database.addItem(new Item(props));

    debug(`File loaded (id=${props.id})`);
  }
}

async function exif(...args) {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage(...args, (err, data) => (err ? reject(err) : resolve(data)));
    } catch(err) {
      reject(err);
    }
  });
}
