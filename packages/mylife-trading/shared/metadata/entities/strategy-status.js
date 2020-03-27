'use strict';

module.exports = {
  id: 'strategy-status',
  parent: 'base',
  name: 'Statut de stratégie',
  fields: [
    { id: 'strategy', name: 'Stratégie', datatype: 'strategy', constraints: ['not-null'] },
    { id: 'status', name: 'Statut', datatype: 'text' },
    { id: 'error', name: 'Erreur', datatype: 'text' },
  ],
  display: obj => obj.display
};
