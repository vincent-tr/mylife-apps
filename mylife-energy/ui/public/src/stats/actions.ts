import { createAsyncThunk, views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const devicesViewRef = new views.ViewReference({
  uid: viewUids.DEVICES,
  service: 'stats',
  method: 'notifyDevices',
});

export const enter = createAsyncThunk('stats/enter', async () => {
  await devicesViewRef.attach();
});

export const leave = createAsyncThunk('stats/leave', async () => {
  await devicesViewRef.detach();
});
