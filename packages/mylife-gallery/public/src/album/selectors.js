'use strict';

import { views, createSelector } from 'mylife-tools-ui';
import { ALBUM_VIEW, DOCUMENT_VIEW } from './view-ids';

const getAlbumState = state => state.album;
export const isShowDetail = state => getAlbumState(state).showDetail;

export const getAlbum = state => views.getView(state, ALBUM_VIEW).first();

const getDocumentView = state => views.getView(state, DOCUMENT_VIEW);

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
