'use strict';

module.exports = {
  id: 'error',
  parent: 'base',
  name: 'Erreur d\'exécution de stratégie',
  fields: [
    { id: 'strategy', name: 'Stratégie', datatype: 'strategy', constraints: ['not-null'] },
    { id: 'strategyImplementation', name: 'Implémentation de la stratégie', datatype: 'strategy-implementation', constraints: ['not-null'] },
    { id: 'version', name: 'Numéro de version du moteur', datatype: 'name', constraints: ['not-null'] },
    { id: 'demo', name: 'Démo', datatype: 'boolean', constraints: ['not-null'] },
    { id: 'date', name: 'Date/heure de l\'erreur',  datatype: 'datetime', constraints: ['not-null'] },
    { id: 'message', name: 'Message de l\'erreur',  datatype: 'text', constraints: ['not-null'] },
    { id: 'stack', name: 'Pile de l\'erreur',  datatype: 'text', constraints: ['not-null'] },
  ],
  display: obj => obj.message
};
