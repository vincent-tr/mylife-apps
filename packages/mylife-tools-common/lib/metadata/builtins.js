'use strict';

exports.datatypes = [
  { id: 'identifier', primitive: 'string', constraints: ['not-null', 'read-only'] },
  { id: 'name', primitive: 'string' },
  { id: 'text', primitive: 'string' },
  { id: 'amount', primitive: 'number' },
  { id: 'count', primitive: 'number' },
  { id: 'date', primitive: 'timestamp' },
  { id: 'datetime', primitive: 'timestamp' },
  { id: 'any', primitive: 'any' },
  { id: 'binary', primitive: 'binary' }
];

exports.entities = [
  {
    id: 'base',
    fields: [
      { id: '_id', datatype: 'identifier', constraints: ['hidden', 'readonly', 'not-null'] }
    ]
  }
];
