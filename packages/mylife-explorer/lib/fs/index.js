'use strict';

const path = require('path');
const fs   = require('fs');
const mime = require('mime-types');

exports.create = function(options) {

  const roots = new Map();
  for(const root of options.roots) {
    roots.set(root.name, root);
  }

  function getFullPath(p) {
    const { root : rootName, path : relative } = splitPath(p);
    const root = roots.get(rootName);
    if(!root) {
      throw new Error(`Invalid path '${p}'`);
    }

    return path.join(root.path, relative);
  }

  async function metadata(p) {
    const { nodes, root : rootName, path : relative } = splitPath(p);
    if(!nodes.length) {
      // root, show virtual root directory
      return await vroot(roots);
    }

    const root = roots.get(rootName);
    if(!root) {
      throw new Error(`Invalid path '${p}'`);
    }

    const fullPath = path.join(root.path, relative);
    const result = await infos(fullPath);

    result.nodes = nodes;
    result.path = '/' + nodes.join('/');

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
  }

  async function getInfos(p) {
    const fullPath = getFullPath(p);
    return await infos(fullPath);
  }

  function createReadStream(p, options) {
    const fullPath = getFullPath(p);
    return fs.createReadStream(fullPath, options);
  }

  return { metadata, getInfos, createReadStream };
};

function splitPath(p) {
  const nodes = p.split('/').filter(n => n);
  return {
    nodes,
    root : nodes[0],
    path : nodes.slice(1).join(path.sep)
  };
}

async function vroot(roots) {
  const result = {
    atime     : 0,
    mtime     : 0,
    ctime     : 0,
    birthtime : 0,
    size      : 0,
    type      : 'Directory',
    nodes     : [],
    path      : '/'
  };

  const list = result.content = [];
  for(const root of roots.values()) {
    list.push({
      name : root.name,
      ... await infos(root.path)
    });
  }

  return result;
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