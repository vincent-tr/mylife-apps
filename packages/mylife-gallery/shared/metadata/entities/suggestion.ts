'use strict';

module.exports = {
  id: 'suggestion',
  parent: 'base',
  name: 'Suggestion',
  fields: [
    { id: 'type', name: 'Type', datatype: 'name' },
    { id: 'definition', name: 'Définition', datatype: 'any' }
  ]
};
