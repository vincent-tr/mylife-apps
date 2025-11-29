import { views } from 'mylife-tools';

const UPSMON_DATA = 'upsmon-data';

export function useUpsmonData() {
  return views.useView({
    slot: UPSMON_DATA,
    service: 'upsmon',
    method: 'notify',
  });
}
