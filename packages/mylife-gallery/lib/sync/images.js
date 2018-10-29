'use strict';

const fs = require('fs').promises;
const path = require('path');
const { images, thumbnails, wrapBinary } = require('../repository');
const config = require('../../conf/config');
const { supportedExtensions, arrayDiff, directoryList } = require('./common');
const { load } = require('./image-loader');

const debug = require('debug')('mylife:gallery:sync:images');

async function fsList(album) {
  const list = [];
  const albumDirectory = path.join(config.gallery, album.name);
  await fsListDir(list, albumDirectory);
  return list;
}

async function dbList(album) {
  const list = await images.listByAlbum(album._id);
  return list.map(({ ipath }) => ipath);
}

exports.diff = async function diff(album) {

  const fsl = await fsList(album);
  const dbl = await dbList(album);

  return arrayDiff(dbl, fsl);
};

async function fsListDir(list, directory) {
  for(const item of await directoryList(directory)) {
    const { ext } = path.parse(item);
    const stat = await fs.lstat(item);

    if(stat.isFile() && ext && supportedExtensions.has(ext.toLowerCase())) {
      list.push(path.relative(config.gallery, item));
      continue;
    }

    if(stat.isDirectory()) {
      await fsListDir(list, item);
    }
  }
}

exports.delete = async function delete_(album, ipath) {
  debug(`Delete image '${ipath}' of album '${album.name}'`);

  const img = await images.getByPath(ipath);
  const thm = await thumbnails.getByIId(img.iid);

  await thumbnails.delete(thm._id);
  await images.delete(img._id);
};

exports.create = async function create(album, ipath) {
  debug(`Create image '${ipath}' of album '${album.name}'`);

  const result = await load(path.join(config.gallery, ipath));
  if(!result) {
    // loading failed
    return;
  }

  const { metadata, iid, mime, thumbnail } = result;
  if(!metadata.tags) {
    metadata.tags = [];
  }
  metadata.tags.push(... ipath.split('/').filter(node => node));

  const thm = {
    iid,
    content : wrapBinary(thumbnail)
  };

  const img = {
    iid,
    ipath,
    album : album._id,
    mime,
    metadata
  };

  await thumbnails.set(thm);
  await images.set(img);
};
