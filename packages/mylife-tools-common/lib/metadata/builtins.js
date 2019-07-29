'use strict';

exports.datatypes = [
  { id: 'identifier', primitive: 'string', constraints: ['not-null', 'read-only'] },
  { id: 'name', primitive: 'string' },
  { id: 'text', primitive: 'string' },
  { id: 'amount', primitive: 'number' },
  { id: 'date', primitive: 'timestamp' },
  { id: 'datetime', primitive: 'timestamp' },
  { id: 'any', primitive: 'any' }
];

exports.entities = [];
