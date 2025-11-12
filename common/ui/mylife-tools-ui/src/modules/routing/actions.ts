// see : https://github.com/supasate/connected-react-router/blob/master/src/actions.js

import { createAction } from 'redux-actions';
import actionTypes from './action-types';

// This action type will be dispatched when your history receives a location change.
export const onLocationChanged = createAction(
  actionTypes.LOCATION_CHANGE,
  (location, action) => ({ location: decodeURI(location.pathname), action })
);

// This action type will be dispatched by the history actions below.
// If you're writing a middleware to watch for navigation events, be sure to look for actions of this type.
const createHistoryAction = method => createAction(actionTypes.CALL_HISTORY_METHOD, (...args) => ({ method, args }), (...args) => null);

// These actions correspond to the history API.
// The associated routerMiddleware will capture these events before they get to
// your reducer and reissue them as the matching function on your history.
export const push = createHistoryAction('push');
export const replace = createHistoryAction('replace');
export const go = createHistoryAction('go');
export const goBack = createHistoryAction('goBack');
export const goForward = createHistoryAction('goForward');
