'use strict';

import { io, views } from 'mylife-tools-ui';
import { docRef } from '../common/document-utils';
import { VIEW } from './view-ids';

// notifyDocument views cannot be updated (because type can change)
const viewRef = new views.ViewReference({
  uid: VIEW,
  criteriaSelector: (state, { type, id }) => ({ type, id }),
  service: 'document',
  method: 'notifyDocumentWithInfo'
});

export const enter = (type, id) => async (dispatch) => {
  await viewRef.attach({ type, id });
};

export const update = (type, id) => async (dispatch) => {
  await viewRef.update({ type, id });
};

export const leave = () => async (dispatch) => {
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
