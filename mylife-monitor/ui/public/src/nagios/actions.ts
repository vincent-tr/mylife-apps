import { createAsyncThunk } from '@reduxjs/toolkit';
import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { resetCriteria } from './store';

const viewRef = new views.ViewReference({
  uid: viewUids.NAGIOS_DATA,
  service: 'nagios',
  method: 'notify'
});

export const enter = createAsyncThunk('nagios/enter', async () => {
  await viewRef.attach();
});

export const leave = createAsyncThunk('nagios/leave', async (_, api) => {
  await viewRef.detach();
  api.dispatch(resetCriteria(null));
});
