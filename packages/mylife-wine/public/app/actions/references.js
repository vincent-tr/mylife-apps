'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const getCapacities  = createAction(actionTypes.QUERY_GET_CAPACITIES);
export const createCapacity = createAction(actionTypes.QUERY_CREATE_CAPACITY);
export const updateCapacity = createAction(actionTypes.QUERY_UPDATE_CAPACITY);
export const deleteCapacity = createAction(actionTypes.QUERY_DELETE_CAPACITY);
export const getDishes      = createAction(actionTypes.QUERY_GET_DISHES);
export const createDish     = createAction(actionTypes.QUERY_CREATE_DISH);
export const updateDish     = createAction(actionTypes.QUERY_UPDATE_DISH);
export const deleteDish     = createAction(actionTypes.QUERY_DELETE_DISH);
export const getRegions     = createAction(actionTypes.QUERY_GET_REGIONS);
export const createRegion   = createAction(actionTypes.QUERY_CREATE_REGION);
export const updateRegion   = createAction(actionTypes.QUERY_UPDATE_REGION);
export const deleteRegion   = createAction(actionTypes.QUERY_DELETE_REGION);
export const getTypes       = createAction(actionTypes.QUERY_GET_TYPES);
export const createType     = createAction(actionTypes.QUERY_CREATE_TYPE);
export const updateType     = createAction(actionTypes.QUERY_UPDATE_TYPE);
export const deleteType     = createAction(actionTypes.QUERY_DELETE_TYPE);
