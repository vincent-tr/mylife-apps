'use strict';

module.exports = [
  { collection: 'account', indexes: [] },
  { collection: 'group', indexes: [{ fields:  'parent' }] },
  { collection: 'operation', indexes: [{ fields: ['account', 'group', 'date'] }] }
];
