'use strict';

const vfs = require('../vfs');
const jimp = require('jimp');
const ExifImage = require('exif').ExifImage;

const Item = require('./item');

const debug = require('debug')('mylife:gallery:repository:loader');

const supportedExtensions = new Set([ '.jpg', '.jpeg', '.png' ]);

exports.load = async function(gallery, database) {
  const directory = await vfs.FSEntry.load(gallery);
  for(const item of await directory.list()) {
    if(!(item instanceof vfs.Directory)) {
      continue;
    }

    debug(`Loading directory ${item.path}`);

    const baseProps = {
      album : item.name
    };

    await loadDirectory(item, database, baseProps);
  }

  await loadDirectory(directory, database, {});
};

async function loadDirectory(directory, database, baseProps) {
  for(const item of await directory.list()) {
    const { name, ext } = item;
    if(!(item instanceof vfs.File) || !supportedExtensions.has(ext)) {
      continue;
    }

    debug(`Loading file ${item.path}`);

    const props = {
      ...baseProps,
      name,
      ext,
      content : await item.content()
    };

    try {
      props.metadata = await exif(props.content);
    } catch(err) {
      console.error(err);
    }

    const image = await jimp.read(props.content);
    props.id = image.hash();
    props.mime = image.getMIME();
    props.thumbnail = await image.scaleToFit(200, 200).getBufferAsync(jimp.MIME_PNG);

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
