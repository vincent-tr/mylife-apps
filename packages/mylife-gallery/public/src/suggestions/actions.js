'use strict';

import { io, views, createAction, dialogs } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getViewId } from './selectors';
import * as browse from '../browse/actions'; // import browse action to drive browse criteria on open

const local = {
  showSuccess: message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success }),
  setView: createAction(actionTypes.SET_VIEW),
  setDialogObjects: createAction(actionTypes.SET_DIALOG_OBJECTS),
};

const getSuggestions = () => views.createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'suggestion',
  method: 'notifySuggestions'
});

const clearSuggestions = () => views.deleteView({
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

export function deleteLoadingErrors(ids) {
  return async (dispatch) => {

    const count = await dispatch(io.call({
      service: 'suggestion',
      method: 'deleteLoadingErrors',
      documents: ids
    }));

    dispatch(local.showSuccess(`${count} Documents supprimés pour ré-intégration`));
  };
}

export const enterCleanOthersDialog = () => async (dispatch) => {
  const objects = await dispatch(io.call({
    service: 'suggestion',
    method: 'cleanOthersList'
  }));

  dispatch(local.setDialogObjects(objects));
};


export const enterCleanDuplicatesDialog = () => async (dispatch) => {
  const objects = await dispatch(io.call({
    service: 'suggestion',
    method: 'cleanDuplicatesList'
  }));

  dispatch(local.setDialogObjects(objects));
};

export const enterMoveSortedDocumentsDialog = (albumId) => async (dispatch) => {
  const objects = await dispatch(io.call({
    service: 'suggestion',
    method: 'moveSortedDocumentsList',
    id: albumId
  }));

  dispatch(local.setDialogObjects(objects));
};

export const enterDeleteLoadingErrorsDialog = () => async (dispatch) => {
  const objects = await dispatch(io.call({
    service: 'suggestion',
    method: 'deleteLoadingErrorsList'
  }));

  dispatch(local.setDialogObjects(objects));
};

export const leaveDialog = () => async (dispatch) => {
  dispatch(local.setDialogObjects(null));
};

export const browseWithCriteria = (criteria) => browse.changeCriteria(criteria);
