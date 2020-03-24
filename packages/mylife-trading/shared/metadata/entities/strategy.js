'use strict';

module.exports = {
  id: 'strategy',
  parent: 'base',
  name: 'Stratégie de trading',
  fields: [
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'implementation', name: 'Implémentation de la stratégie', values: ['todo'], constraints: ['not-null'] },
    { id: 'enabled', name: 'Activé', datatype: 'boolean', constraints: ['not-null'] },
    { id: 'datasource', name: 'Source de données', datatype: 'datasource', constraints: ['not-null'] },
    { id: 'epic', name: 'Instrument de trading', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'risk', name: 'Valeur de risque', description: 'Valeur qu\'on est pret a perdre, dans la devise du compte, pour une prise de position', datatype: 'name', constraints: ['not-null', 'positive'] },
  ],
  display: obj => obj.display
};
