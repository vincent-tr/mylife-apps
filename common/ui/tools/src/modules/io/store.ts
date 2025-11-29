import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STATE_PREFIX } from '../../constants/defines';
import { createAsyncThunk } from '../../services/store-factory';
import { setBusy } from '../dialogs/store';
import { viewChange, viewClose } from '../views/store';
import { ServiceCall } from './service/call-engine';
import { Service, ServiceAPI, ViewChange } from './service';

interface IOState {
  online: boolean;
}

const initialState: IOState = {
  online: false,
};

const ioSlice = createSlice({
  name: `${STATE_PREFIX}/io`,
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.online = action.payload;
    },
  },

  selectors: {
    getOnline: (state) => state.online,
  },
});

const local = {
  setOnline: ioSlice.actions.setOnline,
};

export const unnotify = createAsyncThunk(`${STATE_PREFIX}/io/unnotify`, async (viewId: string, api) => {
  await api.extra.call({
    service: 'common',
    method: 'unnotify',
    viewId,
  });

  api.dispatch(viewClose(viewId));
});

export const { setOnline } = ioSlice.actions; // setOnline can be used in extraReducers
export const { getOnline } = ioSlice.selectors;

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
