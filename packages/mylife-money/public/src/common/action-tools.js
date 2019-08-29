'use strict';

import { io } from 'mylife-tools-ui';

export function createOrUpdateView({ criteriaSelector, viewSelector, setViewAction, service, method }) {
  return async (dispatch, getState) => {
    const state = getState();

    const criteria = criteriaSelector(state);
    const viewId = viewSelector(state);

    if(viewId) {
      await dispatch(io.call({
        service: 'common',
        method: 'renotifyWithCriteria',
        viewId,
        ... criteria
      }));

      return;
    }

    const newViewId = await dispatch(io.call({
      service,
      method,
      ... criteria
    }));

    dispatch(setViewAction(newViewId));
  };
}

export function deleteView({ viewSelector, setViewAction }) {
  return async (dispatch, getState) => {
    const state = getState();
    const oldViewId = viewSelector(state);
    if(!oldViewId) {
      return;
    }

    dispatch(setViewAction(null));
    await dispatch(io.unnotify(oldViewId));
  };
}
