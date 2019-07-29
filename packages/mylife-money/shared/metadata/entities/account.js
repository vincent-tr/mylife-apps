'use strict';

module.exports = {
  id: 'account',
  parent: 'base',
  name: 'Compte bancaire',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name' },
    { id: 'display', name: 'Affichage', datatype: 'name' }
  ],
  display: obj => obj.display
};
