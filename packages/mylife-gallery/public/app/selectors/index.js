'use strict';

export const getAlbums = state => state.albums;

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