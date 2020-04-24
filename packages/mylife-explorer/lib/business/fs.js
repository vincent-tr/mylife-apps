'use strict';

const path = require('path');
const fs   = require('fs');
const mime = require('mime-types');
const { getConfig } = require('mylife-tools-server');

const rootPath = getConfig('root');

exports.metadata = async (p) => {
  const fullPath = getFullPath(p);
  const result = await infos(fullPath);

  switch(result.type) {
    case 'Directory': {
      const names = await fs.promises.readdir(fullPath);
      const list = result.content = [];
      for(const name of names) {
        list.push({
          name,
          ... await infos(path.join(fullPath, name))
        });
      }
      break;
    }
  }

  return result;
};

exports.getInfos = async (p) => {
  const fullPath = getFullPath(p);
  return await infos(fullPath);
};

exports.createReadStream = (p, options) => {
  const fullPath = getFullPath(p);
  return fs.createReadStream(fullPath, options);
};

function getFullPath(relative) {
  if(!relative) {
    return rootPath;
  }
  return path.join(rootPath, relative);
}

async function infos(fullPath) {
  const stats = await fs.promises.lstat(fullPath);

  const result = {
    atime     : stats.atimeMs,
    mtime     : stats.mtimeMs,
    ctime     : stats.ctimeMs,
    birthtime : stats.birthtimeMs,
    size      : stats.size,
    type      : entryType(stats),
  };

  switch(result.type) {
    case 'File': {
      const { ext } = path.parse(fullPath);
      result.mime = mime.lookup(ext);
      break;
    }
  }

  return result;
}

function entryType(stats) {
  if(stats.isBlockDevice())     { return 'BlockDevice'; }
  if(stats.isCharacterDevice()) { return 'CharacterDevice'; }
  if(stats.isDirectory())       { return 'Directory'; }
  if(stats.isFIFO())            { return 'FIFO'; }
  if(stats.isFile())            { return 'File'; }
  if(stats.isSocket())          { return 'Socket'; }
  if(stats.isSymbolicLink())    { return 'SymbolicLink'; }
  return 'Unknown';
}