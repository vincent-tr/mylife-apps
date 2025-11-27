import { views } from 'mylife-tools';

type FIXME_any = any;

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

const getSortedTotalByMonth = views.createViewSelector((view) => Object.values(view).sort((a: FIXME_any, b: FIXME_any) => a.month.localeCompare(b.month)));

export function useTotalByMonth() {
  return views.useSharedView(totalByMonthViewRef, { sorted: getSortedTotalByMonth });
}
