'use strict';

module.exports = {
  id: 'report-group-by-month',
  parent: 'base',
  fields: [
    { id: 'month', name: 'Mois', datatype: 'name' },
    { id: 'group', name: 'Groupe', datatype: 'group' },
    { id: 'stack', name: 'Pile du graphique', datatype: 'name' },
    { id: 'amount', name: 'Montant', datatype: 'amount' },
  ]
};
