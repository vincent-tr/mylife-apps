'use strict';

module.exports = {
  id: 'section',
  parent: 'base',
  name: 'Section',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name' },
    { id: 'display', name: 'Affichage', datatype: 'name' },
    { id: 'order', name: 'Ordre', datatype: 'amount' },
    { id: 'items', name: 'Items', datatype: 'any' }
  ],
  display: obj => obj.display
};
