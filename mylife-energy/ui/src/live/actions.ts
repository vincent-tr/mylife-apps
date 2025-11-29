import { createAsyncThunk, views } from 'mylife-tools';
import * as viewSlots from './view-slots';

const sensorViewRef = new views.ViewReference({
  slot: viewSlots.DEVICES,
  service: 'live',
  method: 'notifyDevices',
});

const measureViewRef = new views.ViewReference({
  slot: viewSlots.MEASURES,
  service: 'live',
  method: 'notifyMeasures',
});

export const enter = createAsyncThunk('live/enter', async (_, _api) => {
  await sensorViewRef.attach();
  await measureViewRef.attach();
});

export const leave = createAsyncThunk('live/leave', async (_, _api) => {
  await sensorViewRef.detach();
  await measureViewRef.detach();
});
