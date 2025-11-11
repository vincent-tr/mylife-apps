'use strict';

import { useEffect, useRef } from 'react';

// can be used with useDebounced when there are closure problems
export function useRefProp(value) {
  const ref = useRef(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
