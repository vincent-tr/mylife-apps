'use strict';

module.exports = [
  { id: 'path', primitive: 'string' },
  {
    id: 'filesystem-item', structure: [
      { id: 'path', name: 'Chemin du fichier', datatype: 'path', constraints: ['not-null'] },
      { id: 'fileUpdateDate', name: 'Date de modification du fichier', datatype: 'datetime', constraints: ['not-null'] },
    ]
  },
  {
    id: 'document-reference', structure: [
      { id: 'type', name: 'Type du document', datatype: 'name', constraints: ['not-null'] },
      { id: 'id', name: 'Identifiant du document', datatype: 'identifier', constraints: ['not-null'] }, // as identifier because it is a polymorph reference
    ]
  }
];
