'use strict';

module.exports = {
  id: 'stat',
  parent: 'base',
  name: 'Statistiques sur prise de position',
  fields: [
    { id: 'strategy', name: 'Stratégie', datatype: 'strategy', constraints: ['not-null'] },
    { id: 'demo', name: 'Démo', datatype: 'boolean', constraints: ['not-null'] },
    { id: 'epic', name: 'Instrument utilisé', datatype: 'name', constraints: ['not-null'] },
    { id: 'dealId', name: 'Identifiant de transaction', datatype: 'name', constraints: ['not-null'] },
    { id: 'openDate', name: 'Date/heure d\'ouverture de la position', datatype: 'datetime', constraints: ['not-null'] },
    { id: 'closeDate', name: 'Date/heure de fermeture de la position', datatype: 'datetime', constraints: ['not-null'] },
    { id: 'openLevel', name: 'Cours à l\'ouverture de la position', datatype: 'real', constraints: ['not-null'] },
    { id: 'closeLevel', name: 'Cours à la fermeture de la position', datatype: 'real', constraints: ['not-null'] },
    { id: 'size', name: 'Nombre de contrats', datatype: 'amount', constraints: ['not-null'] },
    { id: 'profitAndLoss', name: 'Profit et perte', datatype: 'amount', constraints: ['not-null'] },
    { id: 'currency', name: 'Devise', datatype: 'string', constraints: ['not-null'] },
  ],
  display: obj => obj.display
};
