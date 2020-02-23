'use strict';

module.exports = {
  id: 'account',
  parent: 'base',
  name: 'Compte bancaire',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] }
  ],
  display: obj => obj.display
};
