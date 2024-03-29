export const datatypes = [
  { id: 'identifier', primitive: 'string', constraints: ['not-null', 'read-only'] },
  { id: 'name', primitive: 'string' },
  { id: 'text', primitive: 'string' },
  { id: 'amount', primitive: 'number' },
  { id: 'count', primitive: 'number' },
  { id: 'real', primitive: 'number' },
  { id: 'date', primitive: 'timestamp' },
  { id: 'datetime', primitive: 'timestamp' },
  { id: 'boolean', primitive: 'boolean' },
  { id: 'any', primitive: 'any' },
  { id: 'binary', primitive: 'binary' },
];

export const entities = [
  {
    id: 'base',
    fields: [
      { id: '_id', datatype: 'identifier', constraints: ['hidden', 'readonly', 'not-null'] }
    ]
  }
];
