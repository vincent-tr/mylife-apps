'use strict';

import { debounce } from 'debounce';
import { Mutex } from 'async-mutex';

// needed  because refrsh impl is not atomic
const mutex = new Mutex();

export function createDebouncedRefresh(refresh, timeout = 10) {
  let dispatch;
  let initRefs;
  let finalRefs;

  const callRefresh = async () => {
    const local = { dispatch, initRefs, finalRefs };
    dispatch = initRefs = finalRefs = undefined;

    await mutex.runExclusive(async () => {
      await refresh(local.dispatch, local.initRefs, local.finalRefs);
    });
  };

  const debounced = debounce(callRefresh, timeout);

  return (disp, prevState, currentState) => {
    dispatch = disp;
    if(initRefs === undefined) {
      initRefs = prevState;
    }
    finalRefs = currentState;
    debounced();
  };
}
