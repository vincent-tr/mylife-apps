import { createAsyncThunk, views } from 'mylife-tools';
import * as viewSlots from './view-slots';

const viewRef = new views.ViewReference({
  slot: viewSlots.DATA,
  service: 'home',
  method: 'notifyHomeData',
});

export const enter = createAsyncThunk('home/enter', async (_, _api) => {
  await viewRef.attach();
});

export const leave = createAsyncThunk('home/leave', async (_, _api) => {
  await viewRef.detach();
});
