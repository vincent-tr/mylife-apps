'use strict';

module.exports = {
  id: 'report-total-by-month',
  parent: 'base',
  fields: [
    { id: 'month', name: 'Mois', datatype: 'name' },
    { id: 'count', name: 'Nombre d\'opérations', datatype: 'count' },
    { id: 'sumDebit', name: 'Débit', datatype: 'amount' },
    { id: 'sumCredit', name: 'Crédit', datatype: 'amount' },
    { id: 'balance', name: 'Total', datatype: 'amount' },
  ]
};
