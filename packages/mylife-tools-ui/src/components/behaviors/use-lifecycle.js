'use strict';

import { useEffect } from 'react';

export default function(onMount, onUnmout = () => {}) {
  useEffect(() => {
    onMount();
    return onUnmout;
  }, []);
}
