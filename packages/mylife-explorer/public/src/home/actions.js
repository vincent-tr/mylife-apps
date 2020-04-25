'use strict';

import { io, createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';

const setData = createAction(actionTypes.SET_DATA);

export const fetchInfos = (path) => async (dispatch) => {
  dispatch(setData(null));

  const data = await dispatch(io.call({
    service: 'metadata',
    method: 'get',
    path
  }));

  dispatch(setData(data));
};
