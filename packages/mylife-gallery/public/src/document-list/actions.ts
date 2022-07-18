'use strict';

import { io, dialogs } from 'mylife-tools-ui';
import { docRef } from '../common/document-utils';

const showSuccess = message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success });

function createAlbumWithDocuments(documents, title) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'createAlbumFromDocuments',
      title,
      documents: documents.map(docRef)
    }));

  };
}

function addDocumentsToAlbum(documents, albumId) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'addDocumentsToAlbum',
      id: albumId,
      references: documents.map(docRef)
    }));

  };
}

function removeDocumentsFromAlbum(documents, albumId) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'removeDocumentsFromAlbum',
      id: albumId,
      references: documents.map(docRef)
    }));

  };
}

function createPersonWithDocuments(documents, firstName, lastName) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'person',
      method: 'createPersonFromDocuments',
      firstName,
      lastName,
      documents: documents.map(docRef)
    }));

  };
}

function addPersonsToDocuments(documents, personId) {
  return async (dispatch) => {

    for(const document of documents) {
      await dispatch(io.call({
        service: 'document',
        method: 'addPersonToDocument',
        ... docRef(document),
        personId
      }));
    }

  };
}

function removePersonFromDocuments(documents, personId) {
  return async (dispatch) => {

    for(const document of documents) {
      await dispatch(io.call({
        service: 'document',
        method: 'removePersonToDocument',
        ... docRef(document),
        personId
      }));
    }
  };
}

export function saveAlbums(documents, { newObjects, objectsAdd, objectsRemove }) {
  return async (dispatch) => {
    for(const newAlbum of newObjects) {
      if(!newAlbum.selected) {
        // ignore new objects without selection
        continue;
      }

      await dispatch(createAlbumWithDocuments(documents, newAlbum.name));
    }

    for(const [albumId, documents] of objectsAdd.entries()) {
      await dispatch(addDocumentsToAlbum(documents, albumId));
    }

    for(const [albumId, documents] of objectsRemove.entries()) {
      await dispatch(removeDocumentsFromAlbum(documents, albumId));
    }

    dispatch(showSuccess('Modifications effectuées'));
  };
}

export function savePersons(documents, { newObjects, objectsAdd, objectsRemove }) {
  return async (dispatch) => {
    for(const newPerson of newObjects) {
      if(!newPerson.selected) {
        // ignore new objects without selection
        continue;
      }

      await dispatch(createPersonWithDocuments(documents, newPerson.firstName, newPerson.lastName));
    }

    for(const [personId, documents] of objectsAdd.entries()) {
      await dispatch(addPersonsToDocuments(documents, personId));
    }

    for(const [personId, documents] of objectsRemove.entries()) {
      await dispatch(removePersonFromDocuments(documents, personId));
    }

    dispatch(showSuccess('Modifications effectuées'));
  };
}

export function addKeywordToDocuments(documents, keyword) {
  return async (dispatch) => {

    for(const document of documents) {
      await dispatch(io.call({
        service: 'document',
        method: 'addKeywordToDocument',
        ... docRef(document),
        keyword
      }));
    }

  };}

export function removeKeywordFromDocuments(documents, keyword) {
  return async (dispatch) => {

    for(const document of documents) {
      await dispatch(io.call({
        service: 'document',
        method: 'removeKeywordToDocument',
        ... docRef(document),
        keyword
      }));
    }
  };
}
