import { createAsyncThunk } from 'mylife-tools';
import { TeslaMode } from '../api';

export const setMode = createAsyncThunk('tesla/setMode', async (mode: TeslaMode, api) => {
  await api.extra.call({
    service: 'tesla',
    method: 'setMode',
    mode,
  });
});

export const setParameters = createAsyncThunk(
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
