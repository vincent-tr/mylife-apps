'use strict';

module.exports = {
  id: 'historical-data',
  parent: 'base',
  name: 'Historique de données pour backtesting',
  fields: [
    { id: 'instrumentId', name: 'Instrument de trading', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'resolution', name: 'Résolution', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'date', name: 'Date/heure', datatype: 'datetime', constraints: ['not-null'] },
    { id: 'open', name: 'Niveau à l\'ouverture', datatype: 'real', constraints: ['not-null'] },
    { id: 'close', name: 'Niveau à la fermature', datatype: 'real', constraints: ['not-null'] },
    { id: 'high', name: 'Niveau au plus haut', datatype: 'real', constraints: ['not-null'] },
    { id: 'low', name: 'Niveau au plus bas', datatype: 'real', constraints: ['not-null'] },
  ]
};
