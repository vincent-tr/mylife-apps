'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { createOrRenewView, deleteView } from '../common/action-tools';
import { docRef } from '../common/document-utils';
import actionTypes from './action-types';
import { getDocumentViewId, getKeywordsViewId } from './selectors';

const local = {
  setDocumentView: createAction(actionTypes.SET_DOCUMENT_VIEW),
  setKeywordsView: createAction(actionTypes.SET_KEYWORDS_VIEW),
};

// notifyDocument views cannot be updated (because type can change)
export const fetchDocumentView = (type, id) => createOrRenewView({
  criteriaSelector: () => ({ type, id }),
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView,
  service: 'document',
  method: 'notifyDocumentWithInfo'
});

export const clearDocumentView = () => deleteView({
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView
});

export const fetchKeywordsView = () => createOrRenewView({
  criteriaSelector: () => null,
  viewSelector: getKeywordsViewId,
  setViewAction: local.setKeywordsView,
  service: 'keyword',
  method: 'notifyKeywords'
});

export const clearKeywordsView = () => deleteView({
  viewSelector: getKeywordsViewId,
  setViewAction: local.setKeywordsView
});

export function updateDocument(document, values) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'document',
      method: 'updateDocument',
      ...docRef(document),
      values
    }));

  };
}

export function addDocumentToAlbum(document, album) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'addDocumentToAlbum',
      id: album._id,
      reference: docRef(document)
    }));

  };
}

export function removeDocumentFromAlbum(document, album) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'removeDocumentFromAlbum',
      id: album._id,
      reference: docRef(document)
    }));

  };
}
