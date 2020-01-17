'use strict';

module.exports = {
  id: 'slideshow-image',
  parent: 'base',
  name: 'Image de diaporama',
  fields: [
    { id: 'slideshow', name: 'Diaporama', datatype: 'slideshow', constraints: ['not-null'] },
    { id: 'index', name: 'Position dans le diaporama', datatype: 'count', constraints: ['not-null'] },
    { id: 'thumbnail', name: 'Miniature', datatype: 'identifier', constraints: ['not-null'] }, // we do not directly reference thumbnail because it is not loaded as store collection
    { id: 'media', name: 'Média', datatype: 'identifier', constraints: ['not-null'] }, // we do not directly reference gridfs file because it is not loaded as store collection
  ]
};
