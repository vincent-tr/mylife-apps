'use strict';

module.exports = {
  id: 'broker',
  parent: 'base',
  name: 'Compte de courtier de trading',
  fields: [
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'type', name: 'Type', datatype: 'broker-type', constraints: ['not-null'] },
    { id: 'credentials', name: 'Identifiants', datatype: 'broker-credentials' },
    { id: 'test-settings', name: 'Paramètres de test', datatype: 'broker-test-settings' },
  ],
  display: obj => obj.display
};
