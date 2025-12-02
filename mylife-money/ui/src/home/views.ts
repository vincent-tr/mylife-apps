import { createSelector } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import * as api from '../api';
import { useAppSelector } from '../store';

const OPERATION_STATS = 'home-operation-stats';
const TOTAL_BY_MONTH = 'home-total-by-month';

export const getOperationStatsView = (state) => views.getViewBySlot<api.ReportOperationStat>(state, OPERATION_STATS);
export const getTotalByMonthView = (state) => views.getViewBySlot<api.ReportTotalByMonth>(state, TOTAL_BY_MONTH);

export function useOperationStatsView() {
  return views.useSharedView<api.ReportOperationStat>({
    slot: OPERATION_STATS,
    service: 'reporting',
    method: 'notifyOperationStats',
  });
}

const getSortedTotalByMonth = createSelector([getTotalByMonthView], (view) => Object.values(view).sort((a, b) => a.month.localeCompare(b.month)));

export function useTotalByMonthView() {
  views.useSharedView<api.ReportTotalByMonth>({
    slot: TOTAL_BY_MONTH,
    service: 'reporting',
    method: 'notifyTotalByMonth',
  });
  return useAppSelector(getSortedTotalByMonth);
}
