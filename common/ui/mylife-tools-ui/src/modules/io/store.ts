import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STATE_PREFIX } from '../../constants/defines';
import { createAsyncThunk } from '../../services/store-factory';
import { setBusy } from '../dialogs/store';
import { View } from '../views';
import { Entity } from '../views/types';
import { ServiceCall } from './service/call-engine';
import { Service, ServiceAPI, ViewChange } from './service';

interface IOState {
  online: boolean;
  views: { [viewId: string]: View<Entity> };
}

type ViewChangePayload = ViewChange;

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

export const unnotify = createAsyncThunk(`${STATE_PREFIX}/io/unnotify`, async (viewId: string, api) => {
  await api.extra.call({
    service: 'common',
    method: 'unnotify',
    viewId,
  });

  api.dispatch(local.viewClose(viewId));
});

export const { viewChange, setOnline } = ioSlice.actions; // setOnline can be used in extraReducers
export const { getOnline, getView } = ioSlice.selectors;

export default ioSlice.reducer;

class ServiceApiImpl implements ServiceAPI {
  private dispatch;

  setOnline(online: boolean): void {
    if (this.dispatch) {
      this.dispatch(local.setOnline(online));
    } else {
      console.error('ServiceApiImpl: dispatch not set, cannot set online status');
    }
  }

  setBusy(busy: boolean): void {
    if (this.dispatch) {
      this.dispatch(setBusy(busy));
    } else {
      console.error('ServiceApiImpl: dispatch not set, cannot set busy status');
    }
  }

  viewChange(changes: ViewChange): void {
    if (this.dispatch) {
      this.dispatch(viewChange(changes));
    } else {
      console.error('ServiceApiImpl: dispatch not set, cannot dispatch view change');
    }
  }

  connectStoreDispatcher(dispatch) {
    this.dispatch = dispatch;
  }
}

const serviceApi = new ServiceApiImpl();
const service = new Service(serviceApi);

export async function call(message: ServiceCall) {
  return await service.executeCall(message);
}

export function connectStoreDispatcher(dispatch) {
  serviceApi.connectStoreDispatcher(dispatch);
}
