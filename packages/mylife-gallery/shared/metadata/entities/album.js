'use strict';

module.exports = {
  id: 'album',
  parent: 'base',
  name: 'Album',
  fields: [
    { id: 'title', name: 'Titre', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'caption', name: 'Légende', datatype: 'text' },
    { id: 'documents', name: 'Documents', datatype: 'any' }, // array of { type, id }
    { id: 'keywords', name: 'Mots clés', datatype: 'any' }, // string array
    { id: 'thumbnails', name: 'Miniatures', datatype: 'any' }, // id array
  ],
  display: obj => obj.title
};
