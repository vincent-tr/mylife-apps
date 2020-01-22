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

export function createAlbumWithDocument(document, title) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'createAlbumFromDocuments',
      title,
      documents: [docRef(document)]
    }));

  };
}

export function addDocumentToAlbum(document, album) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'addDocumentsToAlbum',
      id: album._id,
      references: [docRef(document)]
    }));

  };
}

export function removeDocumentFromAlbum(document, album) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'removeDocumentsFromAlbum',
      id: album._id,
      references: [docRef(document)]
    }));

  };
}

export function createPersonWithDocument(document, firstName, lastName) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'person',
      method: 'createPersonFromDocuments',
      firstName,
      lastName,
      documents: [docRef(document)]
    }));

  };
}

export function addPersonToDocument(document, person) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'document',
      method: 'addPersonToDocument',
      ... docRef(document),
      personId: person._id
    }));

  };
}

export function removePersonFromDocument(document, person) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'document',
      method: 'removePersonToDocument',
      ... docRef(document),
      personId: person._id
    }));

  };
}


addPersonToDocument, removePersonFromDocument, createPersonWithDocument
