import { createSelector } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import * as api from '../api';
import { AppState, useAppSelector } from '../store-api';
import { useSharedView } from '../views-api';

const OPERATION_STATS = 'home-operation-stats';
const TOTAL_BY_MONTH = 'home-total-by-month';

export const getOperationStatsView = (state: AppState) => views.getViewBySlot<api.ReportOperationStat>(state, OPERATION_STATS);
export const getTotalByMonthView = (state: AppState) => views.getViewBySlot<api.ReportTotalByMonth>(state, TOTAL_BY_MONTH);

export function useOperationStatsView() {
  return useSharedView<api.ReportOperationStat>({
    slot: OPERATION_STATS,
    viewCreatorApi: async (api) => await api.reporting.notifyOperationStats(),
  });
}

const getSortedTotalByMonth = createSelector([getTotalByMonthView], (view) => Object.values(view).sort((a, b) => a.month.localeCompare(b.month)));

export function useTotalByMonthView() {
  useSharedView<api.ReportTotalByMonth>({
    slot: TOTAL_BY_MONTH,
    viewCreatorApi: async (api) => await api.reporting.notifyTotalByMonth(),
  });
  return useAppSelector(getSortedTotalByMonth);
}
