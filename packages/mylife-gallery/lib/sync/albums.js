'use strict';

const fs = require('fs').promises;
const path = require('path');
const { createLogger, getConfig } = require('mylife-tools-server');
const { albums, images, thumbnails } = require('../repository');
const { supportedExtensions, arrayDiff, directoryList } = require('./common');


const logger = createLogger('mylife:gallery:sync:albums');

async function fsList() {
  const list = [];
  // a directory with at least one image inside
  for(const item of await directoryList(getConfig('gallery'))) {
    const stat = await fs.lstat(item);
    if(!stat.isDirectory()) {
      continue;
    }

    if(!await findImage(item)) {
      continue;
    }

    list.push(path.basename(item));
  }
  return list;
}

async function dbList() {
  const list = await albums.list();
  return list.map(({ name }) => name);
}

exports.diff = async function diff() {

  const fsl = await fsList();
  const dbl = await dbList();

  return arrayDiff(dbl, fsl);
};

async function findImage(dir) {
  const subdirs = [];

  for(const item of await directoryList(dir)) {
    const { ext } = path.parse(item);
    const stat = await fs.lstat(item);

    if(stat.isFile() && ext && supportedExtensions.has(ext.toLowerCase())) {
      return true;
    }

    if(stat.isDirectory()) {
      subdirs.push(item);
    }
  }

  for(const subdir of subdirs) {
    if(await findImage(subdir)) {
      return true;
    }
  }

  return false;
}

exports.delete = async function delete_(name) {
  logger.info(`Delete album ${name}`);

  const album = await albums.getByName(name);
  const imgs = await images.listByAlbum(album._id);
  const thms = await thumbnails.listByMultipleIIds(imgs.map(({ iid }) => iid));

  // delete thumbnails, images, album
  for(const thm of thms) {
    await thumbnails.delete(thm._id);
  }
  for(const img of imgs) {
    await images.delete(img._id);
  }
  await albums.delete(album._id);
};

exports.update = async function update(name) {
  logger.info(`Update album ${name}`);
  return await albums.getByName(name);
};

exports.create = async function create(name) {
  logger.info(`Create album ${name}`);

  const album = { name };
  await albums.set(album);
  return album;
};

exports.aggregate = async function aggregate(album) {
  logger.info(`Aggregate album ${album.name}`);

  const imgs = await images.listByAlbum(album._id);
  const first = imgs[0];

  album.first = first.iid;
  album.count = imgs.length;

  await albums.set(album);
};
