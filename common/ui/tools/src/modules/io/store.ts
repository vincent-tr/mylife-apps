import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STATE_PREFIX } from '../../constants/defines';
import { createToolsAsyncThunk } from '../../services/store-factory';
import { viewClose } from '../views/store';

interface IOState {
  online: boolean;
  busy: boolean;
}

const initialState: IOState = {
  online: false,
  busy: false,
};

const ioSlice = createSlice({
  name: `${STATE_PREFIX}/io`,
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.online = action.payload;
    },
    setBusy(state, action: PayloadAction<boolean>) {
      state.busy = action.payload;
    },
  },

  selectors: {
    getOnline: (state) => state.online,
    getBusy: (state) => state.busy,
  },
});

export const unnotify = createToolsAsyncThunk(`${STATE_PREFIX}/io/unnotify`, async (viewId: string, api) => {
  await api.extra.call({
    service: 'common',
    method: 'unnotify',
    viewId,
  });

  api.dispatch(viewClose(viewId));
});

export const { setOnline, setBusy } = ioSlice.actions;
export const { getOnline, getBusy } = ioSlice.selectors;

export default ioSlice.reducer;
