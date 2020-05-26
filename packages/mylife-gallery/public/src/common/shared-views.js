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

const personViewRef = new views.SharedViewReference({
  uid: 'persons',
  criteriaSelector: () => ({ criteria: {} }),
  service: 'person',
  method: 'notifyPersons'
});

const getPersons = views.createViewSelector((view) => view.valueSeq().sort(personComparer).toArray());

export function personComparer(person1, person2) {
  // sort by first name then last name (ignore case)
  const firstName1 = person1.firstName.toUpperCase();
  const firstName2 = person2.firstName.toUpperCase();

  if(firstName1 !== firstName2) {
    return firstName1 < firstName2 ? -1 : 1;
  }

  const lastName1 = person1.lastName.toUpperCase();
  const lastName2 = person2.lastName.toUpperCase();

  if(lastName1 !== lastName2) {
    return lastName1 < lastName2 ? -1 : 1;
  }

  return person1._id < person2._id ? -1 : 1;
}

export function usePersonView() {
  return views.useSharedView(personViewRef, { persons: getPersons });
}

// ---
