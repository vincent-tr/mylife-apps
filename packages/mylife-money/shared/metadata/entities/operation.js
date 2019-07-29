'use strict';

module.exports = {
  id: 'operation',
  parent: 'base',
  name: 'Operation',
  fields: [
    { id: 'date', name: 'Date', datatype: 'date', constraints: ['not-null'] },
    { id: 'amount', name: 'Montant', datatype: 'amount', constraints: ['not-null'] },
    { id: 'label', name: 'Libellé', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'account', name: 'Compte', datatype: 'account', constraints: ['not-null'] },
    { id: 'group', name: 'Groupe', datatype: 'group', constraints: ['not-null'] }
  ],
  display: obj => `${obj.date} - ${obj.amount} (${obj.label})`
};
