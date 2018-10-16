'use strict';

const fs    = require('fs').promises;
const path  = require('path');
const jimp = require('jimp');
const ExifImage = require('exif').ExifImage;

const debug = require('debug')('mylife:gallery:repository:loader');

const supportedExtensions = new Set([ '.jpg', '.jpeg', '.png' ]);

exports.discover = async function discover(fullPath) {
  const list = [];

  const items = await directoryList(fullPath);
  for(const item of items) {
    const stat = await fs.lstat(item);
    if(!stat.isDirectory()) {
      continue;
    }

    await discoverDirectory(list, await directoryList(item), { album : path.basename(item) });
  }

  await discoverDirectory(list, items, {});

  return list;
};

async function discoverDirectory(list, items, baseMetadata) {
  for(const file of items) {
    const { name, ext } = path.parse(file);
    const stat = await fs.lstat(file);
    if(!stat.isFile() || !ext || !supportedExtensions.has(ext.toUpperCase())) {
      continue;
    }

    list.push({
      metadata : {
        ... baseMetadata,
        name
      },
      file : {
        path      : file,
        timestamp : await stat.mtimeMs
      }
    });
  }
}

exports.load = async function load(cachePath, repository, items) {
  const cacheDirectory = await initCacheDirectory(cachePath);
  for(const item of items) {
    repository.addItem(await loadFile(item, cacheDirectory));
  }
};

exports.unload = async function unload(cachePath, repository, items) {
  const cacheDirectory = await initCacheDirectory(cachePath);

  for(const { id } of items) {
    repository.removeItem(id);
    await cacheDirectory.deleteFile(`${id}.png`);
  }
};

async function initCacheDirectory(cachePath) {
  const dir = path.join(cachePath, 'thumbnail');
  await ensureDirectory(dir);
  return dir;
}

async function loadFile(item, cacheDirectory) {

  debug(`Loading file ${item.file.path}`);

  const props = {};
  const metadata = props.metadata = { ... item.metadata };
  const file = props.file = { ... item.file };

  const content = await fs.readFile(item.file.path);

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
  const thumbnail = path.join(cacheDirectory, `${props.id}.png`);
  await fs.writeFile(thumbnail, thumbnailContent);
  file.thumbnail = thumbnail;

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

async function ensureDirectory(path) {
  try {
    await fs.mkdir(path);
  } catch(err) {
    if(err.code !== 'EEXIST') {
      throw err;
    }

    const stat = await fs.stat(path);
    if(!stat.isDirectory()) {
      throw err;
    }
  }
}

async function directoryList(dir) {
  const names = await fs.readdir(dir);
  return names.map(name => path.join(dir, name));
}
