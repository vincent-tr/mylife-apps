'use strict';

module.exports = {
  id: 'error',
  parent: 'base',
  name: 'Erreur d\'exécution de stratégie',
  fields: [
    { id: 'strategy', name: 'Stratégie', datatype: 'strategy', constraints: ['not-null'] },
    { id: 'strategyImplementation', name: 'Implémentation de la stratégie', datatype: 'strategy-implementation', constraints: ['not-null'] },
    { id: 'version', name: 'Version', datatype: 'name', constraints: ['not-null'] },
    { id: 'brokerType', name: 'Type de courtier', datatype: 'broker-type', constraints: ['not-null'] },
    { id: 'date', name: 'Date/heure',  datatype: 'datetime', constraints: ['not-null'] },
    { id: 'message', name: 'Message',  datatype: 'text', constraints: ['not-null'] },
    { id: 'stack', name: 'Pile',  datatype: 'text', constraints: ['not-null'] },
  ],
  display: obj => obj.message
};
