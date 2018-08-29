'use strict';

import { createAction }    from 'redux-actions';
import actionTypes         from '../constants/action-types';
import { getMetadataPath } from '../selectors/metadata';

const fetch = createAction(actionTypes.FETCH);
const setMetadata = createAction(actionTypes.METADATA_SET);

export const ensureMetadata = (path) => (dispatch, getState) => {
  const state = getState();
  const currentPath = getMetadataPath(state);
  if(currentPath === path) {
    return;
  }

  if(path.startsWith('/')) {
    path = path.substring(1);
  }

  dispatch(fetch({
    url : `/api/metadata/${path}`,
    resultAction : setMetadata
  }));
};
