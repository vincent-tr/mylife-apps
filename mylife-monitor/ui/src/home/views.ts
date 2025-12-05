import * as api from '../api';
import { useSharedView } from '../views-api';

const NAGIOS_SUMMARY = 'nagios-summary';
const UPSMON_SUMMARY = 'upsmon-summary';
const UPDATES_SUMMARY = 'updates-summary';

export function useNagiosSummaryView() {
  return useSharedView<api.NagiosSummary>({
    slot: NAGIOS_SUMMARY,
    viewCreatorApi: async (api) => api.nagios.notifySummary(),
  });
}

export function useUpsmonSummaryView() {
  return useSharedView<api.UpsmonSummary>({
    slot: UPSMON_SUMMARY,
    viewCreatorApi: async (api) => api.upsmon.notifySummary(),
  });
}

export function useUpdatesSummaryView() {
  return useSharedView<api.UpdatesSummary>({
    slot: UPDATES_SUMMARY,
    viewCreatorApi: async (api) => api.updates.notifySummary(),
  });
}
