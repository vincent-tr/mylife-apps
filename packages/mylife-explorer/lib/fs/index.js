'use strict';

const path = require('path');
const fs   = require('fs').promises;
const mime = require('mime-types');

exports.create = function(options) {

  const roots = new Map();
  for(const root of options.roots) {
    roots.set(root.name, root);
  }

  async function metadata(p) {
    const { root : rootName, path : relative } = splitPath(p);
    const root = roots.get(rootName);
    if(!root) {
      throw new Error(`Invalid path '${p}'`);
    }

    const fullPath = path.join(root.path, relative);
    const result = await infos(fullPath);

    switch(result.type) {
      case 'Directory': {
        const names = await fs.readdir(fullPath);
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
  }

  return { metadata };
};

function splitPath(p) {
  const nodes = p.split('/').filter(n => n);
  return {
    root : nodes.shift(),
    path : nodes.join(path.sep)
  };
}

async function infos(fullPath) {
  const stats = await fs.lstat(fullPath);

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