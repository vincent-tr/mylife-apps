import { createAsyncThunk } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import { resetCriteria } from './store';
import * as viewSlots from './view-slots';

const viewRef = new views.ViewReference({
  slot: viewSlots.UPDATES_DATA,
  service: 'updates',
  method: 'notify',
});

export const enter = createAsyncThunk('updates/enter', async () => {
  await viewRef.attach();
});

export const leave = createAsyncThunk('updates/leave', async (_, api) => {
  await viewRef.detach();
  api.dispatch(resetCriteria(null));
});
