'use strict';

export const isDetail = state => !!state.detail;
export const getDetailId = state => state.detail && state.detail.id;
export const getDetailName = state => state.detail && state.detail.name;
export const getDetailAlbum = state => state.detail && state.detail.album;
