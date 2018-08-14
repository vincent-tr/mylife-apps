'use strict';

export const getAlbums = state => state.albums;

export const isAlbum = state => !!state.album;
export const getAlbum = state => state.album;

export const isDetail = state => !!state.detail;
export const getDetail = state => state.detail;
