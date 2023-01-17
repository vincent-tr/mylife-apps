'use strict';

module.exports = [
  { collection: 'accounts', entity: 'account', indexes: [] },
  { collection: 'groups', entity: 'group', indexes: [{ fields:  'parent' }] },
  { collection: 'operations', entity: 'operation', indexes: [{ fields: ['account', 'group', 'date'] }] },
  { collection: 'bots', entity: 'bot', indexes: [] },
  { collection: 'bot-runs', entity: 'bot-run', indexes: [] },
];
