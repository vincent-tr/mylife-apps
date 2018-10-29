'use strict';

const fs = require('fs').promises;
const path = require('path');
const { albums } = require('../repository');
const config = require('../../conf/config');

const supportedExtensions = new Set([ '.jpg', '.jpeg', '.png' ]);

async function fsList() {
  const list = [];
  // a directory with at least one image inside
  for(const item of await directoryList(config.gallery)) {
    const stat = await fs.lstat(item);
    if(!stat.isDirectory()) {
      continue;
    }

    if(!findImage(item)) {
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

exports.run = async function run() {

  console.log(await fsList());
  console.log(await dbList());

}

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

async function directoryList(dir) {
  const names = await fs.readdir(dir);
  return names.map(name => path.join(dir, name));
}
