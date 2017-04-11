import { combineReducers } from 'redux';
import { actionTypes } from '../constants/index';

import errors from './errors';
import info from './info';
import references from './references';

export default combineReducers({
  errors,
  info,
  capacities : references(actionTypes.GET_CAPACITIES, actionTypes.CREATE_CAPACITY, actionTypes.UPDATE_CAPACITY, actionTypes.DELETE_CAPACITY),
  dishes     : references(actionTypes.GET_DISHES,     actionTypes.CREATE_DISH,     actionTypes.UPDATE_DISH,     actionTypes.DELETE_DISH),
  regions    : references(actionTypes.GET_REGIONS,    actionTypes.CREATE_REGION,   actionTypes.UPDATE_REGION,   actionTypes.DELETE_REGION),
  types      : references(actionTypes.GET_TYPES,      actionTypes.CREATE_TYPE,     actionTypes.UPDATE_TYPE,     actionTypes.DELETE_TYPE),
});
