'use strict';

module.exports = [
  { id: 'password', primitive: 'string' },
  { id: 'strategy-implementation', enum: ['forex-scalping-m1-extreme'] },
  { id: 'stat-position-order-type', enum: ['open', 'update', 'close'] },
  { 
    id: 'stat-position-order', structure: [
      { id: 'date', name: 'Date de l\'ordre sur la position', datatype: 'datetime', constraints: ['not-null'] },
      { id: 'type', name: 'Type d\'ordre', datatype: 'stat-position-order-type', constraints: ['not-null'] },
      { id: 'takeProfit', name: 'Nouvelle valeur de \'take profit\'', datatype: 'amount' },
      { id: 'stopLoss', name: 'Nouvelle valeur de \'stop loss\'', datatype: 'amount' },
    ]
  },
];
