import EventEmitter from 'events';
import { Resolution } from '../broker';

export interface Timeline extends EventEmitter {
  on(event: 'change', listener: (current: Date) => void): this;
}

export class Timeline extends EventEmitter {
  private _current: Date;

  get current() {
    return this._current;
  }

  constructor(initial: Date) {
    super();
    this._current = initial;
  }

  private incrementMs(value: number) {
    this._current = new Date(this._current.getTime() + value);
    this.emit('change', this._current);
  }

  increment(resolution: Resolution) {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;

    switch (resolution) {
      case Resolution.M1:
        this.incrementMs(MINUTE);
        break;

      case Resolution.M5:
        this.incrementMs(MINUTE * 5);
        break;

      case Resolution.H1:
        this.incrementMs(HOUR);
        break;

      default:
        throw new Error(`Unsupported resolution: '${resolution}'`);
    }
  }

}