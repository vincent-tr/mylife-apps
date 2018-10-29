'use strict';

const fs = require('fs').promises;
const path = require('path');

exports.supportedExtensions = new Set([ '.jpg', '.jpeg', '.png' ]);

exports.arrayDiff = function arrayDiff(from, to) {

  const fset = new Set(from);
  const tset = new Set(to);

  const ret = {
    add : [],
    remove : [],
    keep : []
  };

  for(const value of fset) {
    if(tset.has(value)) {
      ret.keep.push(value);
      continue;
    }
    ret.remove.push(value);
  }

  for(const value of tset) {
    if(!fset.has(value)) {
      ret.add.push(value);
    }
  }

  return ret;
};

exports.directoryList = async function directoryList(dir) {
  const names = await fs.readdir(dir);
  return names.map(name => path.join(dir, name));
};
