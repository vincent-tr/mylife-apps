'use strict';

import io from 'socket.io-client';
import actionTypes from './action-types';
import { setOnline } from './actions';
import { serializer } from 'mylife-tools-common';
import CallEngine from './engines/call';
import NotifyEngine from './engines/notify';

export default (/*store*/) => next => {

  const socket = io();
  const emitter = (message) => socket.emit('message', serializer.serialize(message));

  const engines = {
    call: new CallEngine(emitter, next),
    notify: new NotifyEngine(emitter, next)
  };

  socket.on('connect', () => {
    for(const engine of Object.values(engines)) {
      engine.onConnect();
    }

    next(setOnline(true));
  });

  socket.on('disconnect', (reason) => {
    next(setOnline(false));

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
    if (action.type !== actionTypes.CALL) {
      return next(action);
    }

    next(action);
    return engines.call.executeCall(action.payload);
  };
};
