import { TeslaMode } from '../api';
import { createAppAsyncThunk } from '../store';

export const setMode = createAppAsyncThunk('tesla/setMode', async (mode: TeslaMode, api) => {
  await api.extra.call({
    service: 'tesla',
    method: 'setMode',
    mode,
  });
});

export const setParameters = createAppAsyncThunk(
  'tesla/setParameters',
  async ({ fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent }: { fastLimit: number; smartLimitLow: number; smartLimitHigh: number; smartFastCurrent: number }, api) => {
    await api.extra.call({
      service: 'tesla',
      method: 'setParameters',
      fastLimit,
      smartLimitLow,
      smartLimitHigh,
      smartFastCurrent,
    });
  }
);
