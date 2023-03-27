import { OperationStats } from './business/views/operation-stats';
import { TotalByMonth } from './business/views/total-by-month';
import { dateToMonth } from './business/views/tools';

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