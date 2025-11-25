import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import { serializer } from 'mylife-tools-common';
import { STATE_PREFIX } from '../../constants/defines';
import { View } from '../views';
import { Entity } from '../views/types';
import CallEngine from './engines/call';
import NotifyEngine from './engines/notify';
import { CallPayload } from './types';

interface IOState {
  online: boolean;
  views: { [viewId: string]: View<Entity> };
}

interface ViewChangePayload {
  viewId: string;
  list: Array<{ type: 'set'; object: Entity } | { type: 'unset'; objectId: string }>;
}

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

export const middleware = (/*store*/) => (next) => {
  const socket = io({ transports: ['websocket', 'polling'] });
  const emitter = (message) => socket.emit('message', serializer.serialize(message));

  const engines = {
    call: new CallEngine(emitter, next),
    notify: new NotifyEngine(emitter, next),
  };

  socket.on('connect', () => {
    for (const engine of Object.values(engines)) {
      engine.onConnect();
    }

    next(local.setOnline(true));
  });

  socket.on('disconnect', (reason) => {
    next(local.setOnline(false));
    for (const engine of Object.values(engines)) {
      engine.onDisconnect();
    }

    // failure on network === 'transport closed'
    if (reason === 'io server disconnect') {
      // need to reconnect manually
      socket.connect();
    }
  });

  socket.on('message', (payload) => {
    const message = serializer.deserialize(payload);
    const engine = engines[message.engine];
    if (!engine) {
      console.log(`Message with unknown engine '${message.engine}', ignored`);
      return;
    }

    engine.onMessage(message);
  });

  return (action) => {
    if (action.type !== ACTION_CALL) {
      return next(action);
    }

    next(action);
    return engines.call.executeCall(action.payload as CallPayload);
  };
};
