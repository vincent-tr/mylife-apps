'use strict';

module.exports = {
  id: 'section',
  parent: 'base',
  name: 'Section',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name' },
    { id: 'display', name: 'Affichage', datatype: 'name' },
    { id: 'items', name: 'Items', datatype: 'any' }
  ],
  display: obj => obj.display
};
