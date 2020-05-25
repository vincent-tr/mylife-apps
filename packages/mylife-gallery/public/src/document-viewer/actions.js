'use strict';

import { io, views, createAction } from 'mylife-tools-ui';
import { docRef } from '../common/document-utils';
import actionTypes from './action-types';
import { getDocumentViewId } from './selectors';

const local = {
  setDocumentView: createAction(actionTypes.SET_DOCUMENT_VIEW),
};

// notifyDocument views cannot be updated (because type can change)
export const fetchDocumentView = (type, id) => views.createOrRenewView({
  criteriaSelector: () => ({ type, id }),
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView,
  service: 'document',
  method: 'notifyDocumentWithInfo'
});

export const clearDocumentView = () => views.deleteView({
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView
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
