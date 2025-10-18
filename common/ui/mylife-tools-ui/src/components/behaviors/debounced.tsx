import { useEffect, useState, useRef } from 'react';

const WAIT_INTERVAL = 300;

class Debounce<T> {
  private timer: NodeJS.Timeout;

  constructor(private readonly callback: (args: T) => void, private readonly waitInterval: number) {
    this.timer = null;
  }

  call(args: T) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.doCall(args), this.waitInterval);
  }

  forceCall(args: T) {
    this.doCall(args);
  }

  private doCall(args: T) {
    this.reset();
    this.callback(args);
  }

  reset() {
    clearTimeout(this.timer);
    this.timer = null;
  }
}

export function useDebounced<T>(value: T, onChange, waitInterval = WAIT_INTERVAL) {

  const debounceRef = useRef(new Debounce(value => onChange(value), waitInterval));
  useEffect(() => () => debounceRef.current.reset(), []);

  const [stateValue, setStateValue] = useState(value);
  useEffect(() => {
    setStateValue(value);
    debounceRef.current.reset();
  }, [value]);



  const componentChange = (newValue: T) => {
    setStateValue(newValue);
    debounceRef.current.call(newValue);
  };

  const flush = () => {
    debounceRef.current.forceCall(stateValue);
  };

  return { componentValue: stateValue, componentChange, flush };
}
