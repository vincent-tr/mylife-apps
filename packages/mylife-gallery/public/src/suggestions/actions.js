'use strict';

import { io, createAction, dialogs } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getViewId } from './selectors';
import * as browse from '../browse/actions'; // import browse action to drive browse criteria on open

const local = {
  showSuccess: message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success }),
  setView: createAction(actionTypes.SET_VIEW),
  setCleanDocuments: createAction(actionTypes.SET_CLEAN_DOCUMENTS),
};

const getSuggestions = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'suggestion',
  method: 'notifySuggestions'
});

const clearSuggestions = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const enter = () => async (dispatch) => {
  await dispatch(getSuggestions());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearSuggestions());
};

export function createAlbum(root) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'suggestion',
      method: 'createAlbum',
      root
    }));

    dispatch(local.showSuccess('Album créé'));
  };
}

export function deleteEmptyAlbum(id) {
  return async (dispatch) => {

    const deleted = await dispatch(io.call({
      service: 'suggestion',
      method: 'deleteEmptyAlbum',
      id
    }));

    if(deleted) {
      dispatch(local.showSuccess('Album supprimé'));
    }
  };
}

export const enterCleanOthersDialog = () => async (dispatch) => {
  const documents = await dispatch(io.call({
    service: 'suggestion',
    method: 'cleanOthersList'
  }));

  dispatch(local.setCleanDocuments(documents));
};


export const enterCleanDuplicatesDialog = () => async (dispatch) => {
  const documents = await dispatch(io.call({
    service: 'suggestion',
    method: 'cleanDuplicatesList'
  }));

  dispatch(local.setCleanDocuments(documents));
};

export const leaveCleanDialog = () => async (dispatch) => {
  dispatch(local.setCleanDocuments(null));
};

export const browseWithCriteria = (criteria) => browse.changeCriteria(criteria);
