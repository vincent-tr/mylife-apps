'use strict';

import { io, views, createAction } from 'mylife-tools-ui';
import { docRef } from '../common/document-utils';
import actionTypes from './action-types';
import { VIEW } from './view-ids';
import { getCriteria } from './selectors';

// notifyDocument views cannot be updated (because type can change)
const viewRef = new views.ViewReference({
  uid: VIEW,
  criteriaSelector: getCriteria,
  service: 'document',
  method: 'notifyDocumentWithInfo'
});

const setCriteria = createAction(actionTypes.SET_CRITERIA);

export const enter = (type, id) => async (dispatch) => {
  dispatch(setCriteria({ type, id }));
  await viewRef.attach();
};

export const update = (type, id) => async (dispatch) => {
  dispatch(setCriteria({ type, id }));
  await viewRef.update();
};

export const leave = () => async (dispatch) => {
  dispatch(setCriteria(null));
  await viewRef.detach();
};

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
