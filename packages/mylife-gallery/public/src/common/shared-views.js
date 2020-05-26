'use strict';

import { views } from 'mylife-tools-ui';

const albumViewRef = new views.SharedViewReference({
  uid: 'albums',
  criteriaSelector: () => ({ criteria: {}}),
  service: 'album',
  method: 'notifyAlbums'
});

const getAlbums = views.createViewSelector((view) => view.valueSeq().sort(albumComparer).toArray());

function albumComparer(album1, album2) {
  // sort by title (ignore case)
  const title1 = album1.title.toUpperCase();
  const title2 = album2.title.toUpperCase();

  if(title1 === title2) {
    return album1._id < album2._id ? -1 : 1;
  }

  return title1 < title2 ? -1 : 1;
}

export function useAlbumView() {
  return views.useSharedView(albumViewRef, { albums: getAlbums });
}

// ---

const keywordViewRef = new views.SharedViewReference({
  uid: 'keywords',
  service: 'keyword',
  method: 'notifyKeywords'
});

const getKeywords = views.createViewSelector((view) => view.keySeq().sort().toArray());

export function useKeywordView() {
  return views.useSharedView(keywordViewRef, { keywords: getKeywords });
}

// ---
