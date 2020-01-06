'use strict';

import { io, createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getViewId } from './selectors';

const local = {
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
