import { useState, useEffect } from 'react';
import { useInterval } from 'mylife-tools-ui';

export function useSince(timestamp: Date) {
  const [duration, setDuration] = useState<number>();

  useEffect(computeDuration, [timestamp]);
  useInterval(computeDuration, 500);

  return duration;

  function computeDuration() {
    if (timestamp) {
      setDuration(Date.now() - timestamp.valueOf());
    } else {
      setDuration(null);
    }
  }
}
