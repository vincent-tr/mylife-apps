import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STATE_PREFIX } from '../../constants/defines';
import { setBusy } from '../dialogs/store';
import { View } from '../views';
import { Entity } from '../views/types';
import { Service, ViewChange } from './service';
import { CallPayload } from './types';

interface IOState {
  online: boolean;
  views: { [viewId: string]: View<Entity> };
}

type ViewChangePayload = ViewChange;

const ACTION_CALL = `${STATE_PREFIX}/io/call`;

const initialState: IOState = {
  online: false,
  views: {},
};

const emptyView: View<Entity> = {};

const ioSlice = createSlice({
  name: `${STATE_PREFIX}/io`,
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.online = action.payload;
      state.views = {};
    },
    viewChange(state, action: PayloadAction<ViewChangePayload>) {
      const { viewId, list } = action.payload;
      if (!state.views[viewId]) {
        state.views[viewId] = {};
      }
      const view = state.views[viewId];
      for (const item of list) {
        switch (item.type) {
          case 'set': {
            const { object } = item;
            view[object._id] = object;
            break;
          }
          case 'unset':
            delete view[item.objectId];
            break;
        }
      }
    },
    viewClose(state, action: PayloadAction<string>) {
      const viewId = action.payload;
      delete state.views[viewId];
    },
  },

  selectors: {
    getOnline: (state) => state.online,
    getView: (state, viewId: string) => state.views[viewId] || emptyView,
  },
});

const local = {
  setOnline: ioSlice.actions.setOnline,
  viewClose: ioSlice.actions.viewClose,
};

export const call = createAction<CallPayload>(ACTION_CALL);

export const unnotify = createAsyncThunk(`${STATE_PREFIX}/io/unnotify`, async (viewId: string, api) => {
  await api.dispatch(
    call({
      service: 'common',
      method: 'unnotify',
      viewId,
    })
  );

  api.dispatch(local.viewClose(viewId));
});

export const { viewChange, setOnline } = ioSlice.actions; // setOnline can be used in extraReducers
export const { getOnline, getView } = ioSlice.selectors;

export default ioSlice.reducer;

export const middleware = (_store) => (next) => {
  const serviceApi = {
    setOnline(online: boolean) {
      next(local.setOnline(online));
    },
    setBusy(busy: boolean) {
      next(setBusy(busy));
    },
    viewChange(changes: ViewChange) {
      next(viewChange(changes));
    },
  };

  const service = new Service(serviceApi);

  return (action) => {
    if (action.type !== ACTION_CALL) {
      return next(action);
    }

    next(action);
    return service.executeCall(action.payload as CallPayload);
  };
};
