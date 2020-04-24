'use strict';

export function formatDate(date) {
  return new Date(date).toLocaleString('fr-FR');
}

export function formatSize(size) {
  let i = -1;
  const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    size = size / 1024;
    i++;
  } while (size > 1024);

  return Math.max(size, 0.1).toFixed(1) + byteUnits[i];
}

export function formatPath(... parts) {
  const nodes = [];
  for(const part of parts) {
    nodes.push(...part.split('/').filter(n => n));
  }
  return '/' + nodes.join('/');
}

export function formatContentURL(path) {
  return formatPath('/api/content', path);
}