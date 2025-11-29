import { views } from 'mylife-tools';

const NAGIOS_SUMMARY = 'nagios-summary';
const UPSMON_SUMMARY = 'upsmon-summary';
const UPDATES_SUMMARY = 'updates-summary';

export function useNagiosSummaryView() {
  return views.useView({
    slot: NAGIOS_SUMMARY,
    service: 'nagios',
    method: 'notifySummary',
  });
}

export function useUpsmonSummaryView() {
  return views.useView({
    slot: UPSMON_SUMMARY,
    service: 'upsmon',
    method: 'notifySummary',
  });
}

export function useUpdatesSummaryView() {
  return views.useView({
    slot: UPDATES_SUMMARY,
    service: 'updates',
    method: 'notifySummary',
  });
}
