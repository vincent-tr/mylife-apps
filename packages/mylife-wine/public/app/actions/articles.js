'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const getArticles   = createAction(actionTypes.QUERY_GET_ARTICLES);
export const createArticle = createAction(actionTypes.QUERY_CREATE_ARTICLE);
export const updateArticle = createAction(actionTypes.QUERY_UPDATE_ARTICLE);
export const deleteArticle = createAction(actionTypes.QUERY_DELETE_ARTICLE);
