import { useEffect, useRef } from 'react';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback, interval) {
  const savedCallback = useRef<() => void>(undefined);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current();

    if (typeof interval === 'number') {
      const id = setInterval(tick, interval);
      return () => clearInterval(id);
    }
  }, [interval]);
}
