'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getViewId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
};

export const fetchDocumentView = (type, id) => createOrUpdateView({
  criteriaSelector: () => ({ type, id }),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'document',
  method: 'notifyDocument'
});

export const clearView = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export function updateDocument(document, values) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'document',
      method: 'updateDocument',
      type: document._entity,
      id: document._id,
      values
    }));

  };
}
