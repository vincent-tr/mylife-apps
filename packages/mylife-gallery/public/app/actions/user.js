'use strict';

import { createAction } from 'redux-actions';
import actionTypes from '../constants/action-types';

export const init = createAction(actionTypes.FETCH_ALBUMS);

const setAlbum = createAction(actionTypes.SET_ALBUM);
export const showAlbum = createAction(actionTypes.FETCH_ALBUM);
export const hideAlbum = () => setAlbum(null);

export const showDetail = createAction(actionTypes.SET_DETAIL);
export const hideDetail = () => showDetail(null);