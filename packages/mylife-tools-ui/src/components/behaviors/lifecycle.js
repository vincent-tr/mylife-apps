'use strict';

import { useEffect } from 'react';

export function useLifecycle(onMount, onUnmout = () => {}) {
  useEffect(() => {
    onMount();
    return onUnmout;
  }, []);
}
