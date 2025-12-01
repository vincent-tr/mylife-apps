import { views } from 'mylife-tools';
import * as api from '../api';

const UPSMON_DATA = 'upsmon-data';

export function useUpsmonDataView() {
  return views.useSharedView<api.UpsmonStatus>({
    slot: UPSMON_DATA,
    service: 'upsmon',
    method: 'notify',
  });
}
