import { TeslaMode } from '../api';
import { createAppAsyncThunk } from '../store-api';

export const setMode = createAppAsyncThunk('tesla/setMode', async (mode: TeslaMode, api) => {
  await api.extra.tesla.setMode(mode);
});

export const setParameters = createAppAsyncThunk(
  'tesla/setParameters',
  async ({ fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent }: { fastLimit: number; smartLimitLow: number; smartLimitHigh: number; smartFastCurrent: number }, api) => {
    await api.extra.tesla.setParameters({ fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent });
  }
);
