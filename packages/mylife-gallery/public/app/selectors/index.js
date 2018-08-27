'use strict';

export const getAlbums = state => state.albums && sort(state.albums, a => a.name);

export const isAlbum = state => !!state.album;
export const getAlbum = state => state.album;

export const isDetail = state => !!state.detail;
export const getDetail = state => state.detail;
export const getPrevDetail = state => isDetail(state) ? prevItem(getAlbum(state).items, getDetail(state)) : null;
export const getNextDetail = state => isDetail(state) ? nextItem(getAlbum(state).items, getDetail(state)) : null;

function prevItem(array, item) {
  const index = array.indexOf(item);
  return array[index - 1];
}

function nextItem(array, item) {
  const index = array.indexOf(item);
  return array[index + 1];
}

function sort(array, accessor = (a => a), comparator = defaultComparator) {
  const res = [ ... array ];
  res.sort((a, b) => comparator(accessor(a), accessor(b)));
  return res;
}

// https://github.com/facebook/immutable-js/blob/e65e5af806ea23a32ccf8f56c6fabf39605bac80/src/Operations.js
function defaultComparator(a, b) {
  if (a === undefined && b === undefined) {
    return 0;
  }

  if (a === undefined) {
    return 1;
  }

  if (b === undefined) {
    return -1;
  }

  return a > b ? 1 : a < b ? -1 : 0;
}