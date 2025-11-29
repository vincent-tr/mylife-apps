import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { views } from 'mylife-tools';

type FIXME_any = any;

const operationStatsViewRef = new views.SharedViewReference({
  slot: 'home-operation-stats',
  service: 'reporting',
  method: 'notifyOperationStats',
});

export function useOperationStats() {
  return views.useSharedView(operationStatsViewRef);
}

const totalByMonthViewRef = new views.SharedViewReference({
  slot: 'home-total-by-month',
  service: 'reporting',
  method: 'notifyTotalByMonth',
});

const getSortedTotalByMonth = createSelector([(state: FIXME_any) => views.getViewBySlot(state, totalByMonthViewRef.slot)], (view) =>
  Object.values(view).sort((a: FIXME_any, b: FIXME_any) => a.month.localeCompare(b.month))
);

export function useTotalByMonth() {
  views.useSharedView(totalByMonthViewRef);
  return useSelector(getSortedTotalByMonth);
}
