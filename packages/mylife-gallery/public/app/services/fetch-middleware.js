'use strict';

import { fetchAlbums, fetchAlbum } from '../actions/fetch';
import actionTypes from '../constants/action-types';

export default store => next => action => {
  next(action);

  switch(action.type) {
    case actionTypes.FETCH_ALBUMS:
      doFetch({ url : '/api/albums' }, next, fetchAlbums);
      break;

    case actionTypes.FETCH_ALBUM: {
      const album = action.payload;
      doFetch({ url : `/api/album/${album || '<unset>'}` }, next, items => fetchAlbum({ name : album, items }));
      break;
    }
  }
};

async function doFetch({ url, params }, next, action) {
  try {
    const response = await fetch(url, params);
    const data = await response.json();
    next(action(data));
  } catch(err) {
    console.error(err);
  }
}
