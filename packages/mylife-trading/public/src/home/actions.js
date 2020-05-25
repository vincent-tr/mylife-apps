'use strict';

import { io } from 'mylife-tools-ui';

export const changeState = (strategy, enabled) => async (dispatch) => {
  await dispatch(io.call({
    service: 'strategy',
    method: 'update',
    id: strategy._id,
    values: { enabled }
  }));
};

export const setUiSettings = (strategy, uiSettings) => async (dispatch) => {
  await dispatch(io.call({
    service: 'strategy',
    method: 'update',
    id: strategy._id,
    values: { uiSettings }
  }));
};
