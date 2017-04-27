'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const getCapacities  = createAction(actionTypes.GET_CAPACITIES);
export const createCapacity = createAction(actionTypes.CREATE_CAPACITY);
export const updateCapacity = createAction(actionTypes.UPDATE_CAPACITY);
export const deleteCapacity = createAction(actionTypes.DELETE_CAPACITY);
export const getDishes      = createAction(actionTypes.GET_DISHES);
export const createDish     = createAction(actionTypes.CREATE_DISH);
export const updateDish     = createAction(actionTypes.UPDATE_DISH);
export const deleteDish     = createAction(actionTypes.DELETE_DISH);
export const getRegions     = createAction(actionTypes.GET_REGIONS);
export const createRegion   = createAction(actionTypes.CREATE_REGION);
export const updateRegion   = createAction(actionTypes.UPDATE_REGION);
export const deleteRegion   = createAction(actionTypes.DELETE_REGION);
export const getTypes       = createAction(actionTypes.GET_TYPES);
export const createType     = createAction(actionTypes.CREATE_TYPE);
export const updateType     = createAction(actionTypes.UPDATE_TYPE);
export const deleteType     = createAction(actionTypes.DELETE_TYPE);
export const getArticles    = createAction(actionTypes.GET_ARTICLES);
export const createArticle  = createAction(actionTypes.CREATE_ARTICLE);
export const updateArticle  = createAction(actionTypes.UPDATE_ARTICLE);
export const deleteArticle  = createAction(actionTypes.DELETE_ARTICLE);
