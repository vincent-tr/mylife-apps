import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import io from 'socket.io-client';

import { serializer } from 'mylife-tools-common';
import { View } from '../views';
import { Entity } from '../views/types';
import { CallPayload } from './types';
import { STATE_PREFIX } from '../../constants/defines';
import CallEngine from './engines/call';
import NotifyEngine from './engines/notify';

interface IOState {
  online: boolean;
  views: { [viewId: string]: View<Entity>; };
};

interface ViewChangePayload {
  viewId: string;
  list: Array<
    { type: 'set'; object: Entity; }
    | { type: 'unset'; objectId: string; }
  >;
}

const ACTION_CALL = `${STATE_PREFIX}/io/call`;

const initialState: IOState = {
  online: false,
  views: {},
};

const emptyView: View<Entity> = {};

const ioSlice = createSlice({
  name: 'io',
  reducerPath: `${STATE_PREFIX}/io`,
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
    getViewList: createSelector(
      [
        (state, viewId: string) => ioSlice.getSelectors().getViewList(state, viewId),
      ],
      (view: View<Entity>) => Object.values(view),
    ),
  },
});

const local = {
  setOnline: ioSlice.actions.setOnline,
  viewClose: ioSlice.actions.viewClose,
}

export const call = createAction<CallPayload>(ACTION_CALL);

export const unnotify = (viewId: string, service = 'common') => async dispatch => {

  await dispatch(call({
    service,
    method: 'unnotify',
    viewId
  }));

  dispatch(local.viewClose(viewId));
};

export const { viewChange } = ioSlice.actions;
export const { getOnline, getView, getViewList } = ioSlice.selectors;

export default ioSlice.reducer;

export const middleware = (/*store*/) => next => {

  const socket = io({ transports: ['websocket', 'polling'] });
  const emitter = (message) => socket.emit('message', serializer.serialize(message));

  const engines = {
    call: new CallEngine(emitter, next),
    notify: new NotifyEngine(emitter, next)
  };

  socket.on('connect', () => {
    for(const engine of Object.values(engines)) {
      engine.onConnect();
    }

    next(local.setOnline(true));
  });

  socket.on('disconnect', (reason) => {
    next(local.setOnline(false));
    for(const engine of Object.values(engines)) {
      engine.onDisconnect();
    }

    // failure on network === 'transport closed'
    if(reason === 'io server disconnect') {
      // need to reconnect manually
      socket.connect();
    }
  });

  socket.on('message', payload => {
    const message = serializer.deserialize(payload);
    const engine = engines[message.engine];
    if(!engine) {
      console.log(`Message with unknown engine '${message.engine}', ignored`);
      return;
    }

    engine.onMessage(message);
  });

  return action => {
    if (action.type !== ACTION_CALL) {
      return next(action);
    }

    next(action);
    return engines.call.executeCall(action.payload);
  };
};
