'use strict';

module.exports = {
  id: 'image',
  parent: 'document',
  name: 'Image',
  fields: [
    { id: 'perceptualHash', name: 'Hash perception', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'thumbnail', name: 'Miniature', datatype: 'identifier' }, // we do not directly reference thumbnail because it is not loaded as store collection
    { id: 'mime', name: 'Type mime', datatype: 'name' },
    { id: 'metadata', name: 'Métadonnées', datatype: 'image-metadata' },
    { id: 'width', name: 'Largeur', datatype: 'count' },
    { id: 'height', name: 'Hauteur', datatype: 'count' },
    { id: 'date', name: 'Date de prise de photo', datatype: 'datetime' },
    { id: 'persons', name: 'Personnes', datatype: 'list:image-tag', constraints: ['not-null'], initial: [] },
  ]
};
