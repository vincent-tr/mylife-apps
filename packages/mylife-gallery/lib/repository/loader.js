'use strict';

const path = require('path');
const fs = require('fs').promises;
const jimp = require('jimp');
const ExifImage = require('exif').ExifImage;

const Item = require('./item');

const debug = require('debug')('mylife:gallery:repository:loader');

const supportedExtensions = new Set([ '.jpg' ]);

exports.load = async function(directory, database) {
  for(const fileName of await fs.readdir(directory)) {
    const fullName = path.join(directory, fileName);
    const { name, ext } = path.parse(fullName);
    if(!supportedExtensions.has(ext)) {
      continue;
    }

    debug(`Loading file ${fullName}`);

    const props = {
      name,
      ext,
      content : await fs.readFile(fullName)
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
};

async function exif(...args) {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage(...args, (err, data) => (err ? reject(err) : resolve(data)));
    } catch(err) {
      reject(err);
    }
  });
}
