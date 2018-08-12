'use strict';

const path = require('path');
const fs   = require('fs').promises;

const type = exports.type = 'local';

exports.formatPath = p => `${type}:${p}`;
exports.formatName = p => path.parse(p).name;
exports.formatExt = p => path.parse(p).ext;

exports.entryType = async p => {
  const stat = await fs.lstat(p);
  if(stat.isDirectory()) {
    return 'directory';
  }
  if(stat.isFile()) {
    return 'file';
  }

  throw new Error(`Unsupported stat type on path '${p}'`);
};

exports.directoryList = async p => {
  const names = await fs.readdir(p);
  return names.map(name => path.join(p, name));
};

exports.fileSize = async p => {
  const stat = await fs.lstat(p);
  return stat.size;
};

exports.fileContent = async p => await fs.readFile(p);
