'use strict';

import { createAction } from 'redux-actions';
import actionTypes from '../constants/action-types';

export const fetchAlbums = createAction(actionTypes.SET_ALBUMS);
export const fetchAlbum  = createAction(actionTypes.SET_ALBUM);
