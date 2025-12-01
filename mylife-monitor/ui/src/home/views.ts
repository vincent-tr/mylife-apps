import { views } from 'mylife-tools';
import * as api from '../api';

const NAGIOS_SUMMARY = 'nagios-summary';
const UPSMON_SUMMARY = 'upsmon-summary';
const UPDATES_SUMMARY = 'updates-summary';

export function useNagiosSummaryView() {
  return views.useSharedView<api.NagiosSummary>({
    slot: NAGIOS_SUMMARY,
    service: 'nagios',
    method: 'notifySummary',
  });
}

export function useUpsmonSummaryView() {
  return views.useSharedView<api.UpsmonSummary>({
    slot: UPSMON_SUMMARY,
    service: 'upsmon',
    method: 'notifySummary',
  });
}

export function useUpdatesSummaryView() {
  return views.useSharedView<api.UpdatesSummary>({
    slot: UPDATES_SUMMARY,
    service: 'updates',
    method: 'notifySummary',
  });
}
