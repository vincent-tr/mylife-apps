'use strict';

module.exports = {
  id: 'video',
  parent: 'document',
  name: 'Video',
  fields: [
    { id: 'thumbnails', name: 'Miniatures', datatype: 'any' }, // id array
    { id: 'width', name: 'Largeur', datatype: 'count' },
    { id: 'height', name: 'Hauteur', datatype: 'count' },
    { id: 'persons', name: 'Personnes', datatype: 'any' }, // id array
  ]
};
