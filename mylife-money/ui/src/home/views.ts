import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { views } from 'mylife-tools';

type FIXME_any = any;

const OPERATION_STATS = 'home-operation-stats';
const TOTAL_BY_MONTH = 'home-total-by-month';

export const getOperationStatsView = (state) => views.getViewBySlot(state, OPERATION_STATS);
export const getTotalByMonthView = (state) => views.getViewBySlot(state, TOTAL_BY_MONTH);

export function useOperationStatsView() {
  return views.useSharedView({
    slot: OPERATION_STATS,
    service: 'reporting',
    method: 'notifyOperationStats',
  });
}

const getSortedTotalByMonth = createSelector([getTotalByMonthView], (view) => Object.values(view).sort((a: FIXME_any, b: FIXME_any) => a.month.localeCompare(b.month)));

export function useTotalByMonthView() {
  views.useSharedView({
    slot: TOTAL_BY_MONTH,
    service: 'reporting',
    method: 'notifyTotalByMonth',
  });
  return useSelector(getSortedTotalByMonth);
}
