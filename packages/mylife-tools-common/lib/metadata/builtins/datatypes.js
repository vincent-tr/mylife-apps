'use strict';

exports.datatypes = [
  { id: 'identifier', jstype: 'string', constraints: ['not-null', 'read-only'] },
  { id: 'name', jstype: 'string' },
  { id: 'text', jstype: 'string' },
  { id: 'amount', jstype: 'number' },
  { id: 'date', jstype: 'timestamp' },
  { id: 'datetime', jstype: 'timestamp' },
  { id: 'any', jstype: 'any' }
];
