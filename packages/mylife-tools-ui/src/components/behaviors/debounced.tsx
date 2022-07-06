'use strict';

import { useEffect, useState, useRef } from 'react';

const WAIT_INTERVAL = 300;

class Debounce {
  private timer: NodeJS.Timeout;

  constructor(private readonly callback, private readonly waitInterval) {
    this.timer = null;
  }

  call(args) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.doCall(args), this.waitInterval);
  }

  forceCall(args) {
    this.doCall(args);
  }

  private doCall(args) {
    this.reset();
    this.callback(args);
  }

  reset() {
    clearTimeout(this.timer);
    this.timer = null;
  }
}

export function useDebounced(value, onChange, waitInterval = WAIT_INTERVAL) {

  const debounceRef = useRef(new Debounce(value => onChange(value), waitInterval));
  useEffect(() => () => debounceRef.current.reset(), []);

  const [stateValue, setStateValue] = useState(value);
  useEffect(() => {
    setStateValue(value);
    debounceRef.current.reset();
  }, [value]);



  const componentChange = newValue => {
    setStateValue(newValue);
    debounceRef.current.call(newValue);
  };

  const flush = () => {
    debounceRef.current.forceCall(stateValue);
  };

  return { componentValue: stateValue, componentChange, flush };
}
