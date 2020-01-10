'use strict';

module.exports = {
  id: 'document-with-info',
  parent: 'base',
  name: 'Document avec inf',
  fields: [
    { id: 'document', name: 'Document', datatype: 'document', constraints: ['not-null'] },
    { id: 'info', name: 'Info', datatype: 'document-info', constraints: ['not-null'] },
  ],
  display: obj => obj.document.hash
};
