import { combineReducers } from 'redux';
import { actionTypes } from '../constants/index';

import errors from './errors';
import info from './info';
import crud from './crud';

export default combineReducers({
  errors,
  info,
  capacities : crud(actionTypes.GET_CAPACITIES, actionTypes.CREATE_CAPACITY, actionTypes.UPDATE_CAPACITY, actionTypes.DELETE_CAPACITY),
  dishes     : crud(actionTypes.GET_DISHES,     actionTypes.CREATE_DISH,     actionTypes.UPDATE_DISH,     actionTypes.DELETE_DISH),
  regions    : crud(actionTypes.GET_REGIONS,    actionTypes.CREATE_REGION,   actionTypes.UPDATE_REGION,   actionTypes.DELETE_REGION),
  types      : crud(actionTypes.GET_TYPES,      actionTypes.CREATE_TYPE,     actionTypes.UPDATE_TYPE,     actionTypes.DELETE_TYPE),
  articles   : crud(actionTypes.GET_ARTICLES,   actionTypes.CREATE_ARTICLE,  actionTypes.UPDATE_ARTICLE,  actionTypes.DELETE_ARTICLE),
});
