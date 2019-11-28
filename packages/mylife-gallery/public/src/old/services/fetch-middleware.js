'use strict';

import { fetchAlbums, fetchAlbum } from '../actions/fetch';
import actionTypes from '../constants/action-types';

export default store => next => action => {
  next(action);

  switch(action.type) {
    case actionTypes.FETCH_ALBUMS: {
      const { cb } = action.payload;
      doFetch({ url : '/api/albums' }, cb, next, fetchAlbums);
      break;
    }

    case actionTypes.FETCH_ALBUM: {
      const { albumName, cb } = action.payload;
      doFetch({ url : `/api/album/${albumName}` }, cb, next, items => fetchAlbum({ name : albumName === '<unset>' ? null : albumName, items }));
      break;
    }
  }
};

async function doFetch({ url, params }, cb, next, action) {
  try {
    const response = await fetch(url, params);
    const data = await response.json();
    next(action(data));
    cb && cb();
  } catch(err) {
    console.error(err);
    cb && cb(err);
  }
}
