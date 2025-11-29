import { createAsyncThunk } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import { resetCriteria } from './store';
import * as viewSlots from './view-slots';

const viewRef = new views.ViewReference({
  slot: viewSlots.NAGIOS_DATA,
  service: 'nagios',
  method: 'notify',
});

export const enter = createAsyncThunk('nagios/enter', async () => {
  await viewRef.attach();
});

export const leave = createAsyncThunk('nagios/leave', async (_, api) => {
  await viewRef.detach();
  api.dispatch(resetCriteria(null));
});
