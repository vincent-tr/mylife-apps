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
  { id: 'broker-type', enum: ['backtest', 'ig-demo', 'ig-real'] },
  { 
    id: 'broker-credentials', structure: [
      { id: 'key', name: 'Clé IG', datatype: 'name', constraints: ['not-null', 'not-empty'] },
      { id: 'identifier', name: 'Identifiant IG', datatype: 'name', constraints: ['not-null', 'not-empty'] },
      { id: 'password', name: 'Mot de passe IG', datatype: 'password', constraints: ['not-null', 'not-empty'] },
    ]
  },
  { 
    id: 'broker-test-settings', structure: [
      { id: 'instrumentId', name: 'Instrument de trading', datatype: 'name', constraints: ['not-null', 'not-empty'] },
      { id: 'resolution', name: 'Resolution', datatype: 'name', constraints: ['not-null', 'not-empty'] },
      { id: 'spread', name: 'Spread (en pips)', datatype: 'real', constraints: ['not-null', 'positive'] },
    ]
  },
];
