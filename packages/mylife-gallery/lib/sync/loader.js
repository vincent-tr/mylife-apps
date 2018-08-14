'use strict';

const vfs = require('../vfs');
const jimp = require('jimp');
const ExifImage = require('exif').ExifImage;

const debug = require('debug')('mylife:gallery:repository:loader');

const supportedExtensions = new Set([ '.jpg', '.jpeg', '.png' ]);

exports.discover = async function discover(fullPath) {
  const directory = await vfs.FSEntry.load(fullPath);
  const list = [];

  const items = await directory.list();
  for(const item of items) {
    if(!(item instanceof vfs.Directory)) {
      continue;
    }

    await discoverDirectory(list, await item.list(), { album : item.name });
  }

  await discoverDirectory(list, items, {});

  return list;
};

async function discoverDirectory(list, items, baseMetadata) {
  for(const file of items) {
    const { name, ext } = file;
    if(!(file instanceof vfs.File) || !supportedExtensions.has(ext)) {
      continue;
    }

    list.push({
      props : {
        metadata : {
          ... baseMetadata,
          name
        },
        file : {
          path      : file.fullPath,
          timestamp : await file.lastModified()
        }
      },
      file
    });
  }
}

exports.load = async function load(cachePath, repository, items) {
  const cacheDirectory = await initCacheDirectory(cachePath);
  for(const item of items) {
    repository.addItem(await loadFile(item, cacheDirectory));
  }
};

async function initCacheDirectory(cachePath) {
  const cacheBaseDirectory = await vfs.FSEntry.load(cachePath);
  return await cacheBaseDirectory.ensureDirectory('thumbnail');
}

async function loadFile(item, cacheDirectory) {

  debug(`Loading file ${item.file.path}`);

  const props = {};
  const metadata = props.metadata = { ... item.props.metadata };
  const file = props.file = { ... item.props.file };

  const content = await item.file.content();

  try {
    const { image, exif, gps } = await runExif(content);
    metadata.from = image.Model;
    metadata.date = exif.DateTimeOriginal || exif.CreateDate || exif.ModifyDate;
    metadata.gps = formatGPS(gps);
  } catch(err) {
    console.error(err);
  }

  const image = await jimp.read(content);
  props.id = image.hash();
  file.mime = image.getMIME();

  const thumbnailContent = await image.scaleToFit(200, 200).getBufferAsync(jimp.MIME_PNG);
  const thumbnail = await cacheDirectory.writeFile(`${props.id}.png`, thumbnailContent);
  file.thumbnail = thumbnail.fullPath;

  debug(`File loaded (id=${props.id})`);

  return props;
}

async function runExif(...args) {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage(...args, (err, data) => (err ? reject(err) : resolve(data)));
    } catch(err) {
      reject(err);
    }
  });
}

function formatGPS(gps) {
  if(!gps) {
    return;
  }

  const {
    GPSLatitude,
    GPSLatitudeRef,
    GPSLongitude,
    GPSLongitudeRef,
  } = gps;

  if(!GPSLatitude || !GPSLongitude) {
    return;
  }

  let latitude = timeToDec(GPSLatitude);
  if(GPSLatitudeRef === 'W') {
    latitude *= -1;
  }

  let longitude = timeToDec(GPSLongitude);
  if(GPSLongitudeRef === 'W') {
    longitude *= -1;
  }

  return { latitude, longitude };
}

function timeToDec([ h, m, s ]) {
  return h + m / 60 + s / 3600;
}
