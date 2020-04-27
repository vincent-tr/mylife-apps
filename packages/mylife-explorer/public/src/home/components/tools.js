'use strict';

export function makeUrl(data) {
  return '/_content/' + data.path;
}


export function getName(data) {
  const nodes = data.path.split('/').filter(n => n);
  if(nodes.length) {
    return nodes[nodes.length - 1];
  }
  return '<Racine>';
}
