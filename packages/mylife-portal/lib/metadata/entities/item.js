'use strict';

module.exports = {
  id: 'item',
  parent: 'base',
  name: 'Item',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name' },
    { id: 'display', name: 'Affichage', datatype: 'name' },
    { id: 'icon', name: 'Icone', datatype: 'binary' },
    { id: 'iconMime', name: 'Icone type mime', datatype: 'name' },
    { id: 'target', name: 'Cible', datatype: 'text' }
  ],
  display: obj => obj.display
};
