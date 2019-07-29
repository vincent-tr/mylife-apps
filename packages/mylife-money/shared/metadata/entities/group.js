'use strict';

module.exports = {
  id: 'group',
  parent: 'base',
  name: 'Groupe',
  fields: [
    { id: 'parent', name: 'Groupe parent', datatype: 'group' },
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'rules', name: 'Règles', datatype: 'any' }
  ],
  display: obj => obj.display
};
