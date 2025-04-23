package entities

import "mylife-tools-server/services/store"

var StoreDef = []interface{}{
	store.MakeCollectionBuilder("accounts", "accounts", accountDecode, accountEncode),
	store.MakeCollectionBuilder("groups", "groups", groupDecode, groupEncode),
	store.MakeCollectionBuilder("operations", "operations", operationDecode, operationEncode),
	store.MakeCollectionBuilder("bots", "bots", botDecode, botEncode),
	store.MakeCollectionBuilder("bot-runs", "bot-runs", botRunDecode, botRunEncode),
}

/*
module.exports = [
  { collection: 'accounts', entity: 'account', indexes: [] },
  { collection: 'groups', entity: 'group', indexes: [] },
  { collection: 'operations', entity: 'operation', indexes: [{ name: 'partition-by-month', type: 'partition', keyBuilder: operationToMonth }] },
  { collection: 'bots', entity: 'bot', indexes: [] },
  { collection: 'bot-runs', entity: 'bot-run', indexes: [] },
  { materializedView: 'operation-stats', factory: () => new OperationStats() },
  { materializedView: 'total-by-month', factory: () => new TotalByMonth() },
];

function operationToMonth(operation) {
  return dateToMonth(operation.date);
}
*/
