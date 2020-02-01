'use strict';

export function getPath(document) {
  const fsItem = document.paths.find(fsItem => fsItem.path.startsWith('_'));
  return fsItem && fsItem.path;
}
