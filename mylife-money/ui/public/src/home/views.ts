import { views } from 'mylife-tools-ui';

const operationStatsViewRef = new views.SharedViewReference({
  uid: 'home-operation-stats',
  service: 'reporting',
  method: 'notifyOperationStats',
});

export function useOperationStats() {
  return views.useSharedView(operationStatsViewRef);
}

const totalByMonthViewRef = new views.SharedViewReference({
  uid: 'home-total-by-month',
  service: 'reporting',
  method: 'notifyTotalByMonth',
});

const getSortedTotalByMonth = views.createViewSelector((view) => view.valueSeq().sortBy(item => item.month).toArray());

export function useTotalByMonth() {
  return views.useSharedView(totalByMonthViewRef, { sorted: getSortedTotalByMonth });
}
