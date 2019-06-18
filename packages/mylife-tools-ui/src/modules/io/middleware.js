'use strict';

import io from 'socket.io-client';
import actionTypes from './action-types';
import { setOnline } from './actions';

export default (/*store*/) => next => {

  const socket = io();

  socket.on('connect', () => {
    next(setOnline(true));
  });

  socket.on('disconnect', (reason) => {
    next(setOnline(false));

    // failure on network === 'transport closed'
    if(reason === 'io server disconnect') {
      // need to reconnect manually
      socket.connect();
    }
  });

  socket.on('message', payload => console.log(deserialize(payload)));

  return action => {
    return next(action);
  };
};

function deserialize(payload) {
  return payload;
}
