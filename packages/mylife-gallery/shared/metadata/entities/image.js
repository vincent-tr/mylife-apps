'use strict';

module.exports = {
  id: 'video',
  parent: 'document',
  name: 'Video',
  fields: [
    { id: 'perceptualHash', name: 'Hash perception', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'thumbnail', name: 'Miniature', datatype: 'thumbnail' },
    { id: 'metaDate', name: 'Date métadonnées', datatype: 'datetime' },
    { id: 'gps', name: 'Coordonnées GPS', datatype: 'any' },
    { id: 'width', name: 'Largeur', datatype: 'count' },
    { id: 'height', name: 'Hauteur', datatype: 'count' },
    { id: 'persons', name: 'Personnes', datatype: 'any' }, // array of { personId, rectangle }
  ]
};
