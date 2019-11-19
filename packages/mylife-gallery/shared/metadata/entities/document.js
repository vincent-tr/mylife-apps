'use strict';

module.exports = {
  id: 'document',
  parent: 'base',
  name: 'Document',
  fields: [
    { id: 'hash', name: 'Hash', datatype: 'name', constraints: ['not-null', 'not-empty'] }, // file content hash
    { id: 'paths', name: 'Chemins', datatype: 'any', constraints: ['not-null'] }, // array of { path, fileUpdateDate }
    { id: 'integrationDate', name: 'Date d\'intégration', datatype: 'datetime', constraints: ['not-null'] },
    { id: 'fileSize', name: 'Taille du fichier', datatype: 'count', constraints: ['not-null'] }, // file content hash
    { id: 'caption', name: 'Légende', datatype: 'text' },
    { id: 'keywords', name: 'Mots clés', datatype: 'any' }, // string array
  ],
  display: obj => obj.hash
};
