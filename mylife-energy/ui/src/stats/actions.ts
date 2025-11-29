import { createAsyncThunk, views } from 'mylife-tools';
import * as viewSlots from './view-slots';

const devicesViewRef = new views.ViewReference({
  slot: viewSlots.DEVICES,
  service: 'stats',
  method: 'notifyDevices',
});

export const enter = createAsyncThunk('stats/enter', async () => {
  await devicesViewRef.attach();
});

export const leave = createAsyncThunk('stats/leave', async () => {
  await devicesViewRef.detach();
});
