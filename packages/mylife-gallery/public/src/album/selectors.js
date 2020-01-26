'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getAlbumState = state => state.album;
export const getAlbumId = state => getAlbumState(state).albumId;

export const isShowDetail = state => getAlbumState(state).showDetail;

export const getAlbumViewId = state => getAlbumState(state).albumViewId;
const getAlbumView = state => io.getView(state, getAlbumViewId(state));
export const getAlbum = state => getAlbumView(state).first();

export const getDocumentViewId = state => getAlbumState(state).documentViewId;
const getDocumentView = state => io.getView(state, getDocumentViewId(state));

export const getDocuments = createSelector(
  [ getAlbum, getDocumentView ],
  (album, view) => {
    if(!album || view.size !== album.documents.length) {
      // not ready
      return view.valueSeq().toArray();
    }

    // order the document in the album order
    return album.documents.map(({ id }) => view.get(id));
  }
);
