'use strict';

module.exports = {
  id: 'strategy',
  parent: 'base',
  name: 'Stratégie de trading',
  fields: [
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'implementation', name: 'Implémentation de la stratégie', datatype: 'strategy-implementation', constraints: ['not-null'] },
    { id: 'enabled', name: 'Activé', datatype: 'boolean', constraints: ['not-null'] },
    { id: 'broker', name: 'Compte de courtage', datatype: 'broker', constraints: ['not-null'] },
    { id: 'instrumentId', name: 'Instrument de trading', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'risk', name: 'Valeur de risque', description: 'Valeur qu\'on est pret a perdre, dans la devise du compte, pour une prise de position', datatype: 'amount', constraints: ['not-null', 'positive'] },
  ],
  display: obj => obj.display
};
