import { useEffect, useRef } from 'react';

// can be used with useDebounced when there are closure problems
export function useRefProp<T>(value: T) {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
