'use strict';

module.exports = {
  id: 'item',
  parent: 'base',
  name: 'Item',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name' },
    { id: 'display', name: 'Affichage', datatype: 'name' },
    { id: 'icon', name: 'Icone', datatype: 'binary' }
  ],
  display: obj => obj.display
};
