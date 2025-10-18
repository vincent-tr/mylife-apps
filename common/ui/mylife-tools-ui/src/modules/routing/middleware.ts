'use strict';

import { createBrowserHistory } from 'history';
import actionTypes from './action-types';
import { onLocationChanged } from './actions';

export default (/*store*/) => next => {
  const history = createBrowserHistory();
  const sendHistory = () => next(onLocationChanged(history.location, history.action));
  history.listen(sendHistory);
  sendHistory();

  return action => {
    if (action.type !== actionTypes.CALL_HISTORY_METHOD) {
      return next(action);
    }

    const { method, args } = action.payload;
    history[method](...args);
  };
};
