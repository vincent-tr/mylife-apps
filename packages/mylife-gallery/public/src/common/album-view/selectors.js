'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getBase = state => state.commonAlbumView;
export const getViewId = state => getBase(state).viewId;
export const getAlbumView = state => io.getView(state, getViewId(state));

export const getAlbums = createSelector(
  [ getAlbumView ],
  (view) => view.valueSeq().sort(albumComparer).toArray()
);

export const getRefCount = state => getBase(state).refCount;

function albumComparer(album1, album2) {
  // sort by title (ignore case)
  const title1 = album1.title.toUpperCase();
  const title2 = album2.title.toUpperCase();

  if(title1 === title2) {
    return album1._id < album2._id ? -1 : 1;
  }

  return title1 < title2 ? -1 : 1;
}
