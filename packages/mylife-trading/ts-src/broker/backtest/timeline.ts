import EventEmitter from 'events';
import { Resolution } from '../broker';

export interface Timeline extends EventEmitter {
  on(event: 'change', listener: (current: Date) => void): this;
}

export class Timeline extends EventEmitter implements Timeline {
  private _current: Date;
  private readonly stepMs: number;

  get current() {
    return this._current;
  }

  constructor(resolution: Resolution) {
    super();

    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;

    switch (resolution) {
      case Resolution.M1:
        this.stepMs = MINUTE;
        break;

      case Resolution.M5:
        this.stepMs = MINUTE * 5;
        break;

      case Resolution.H1:
        this.stepMs = HOUR;
        break;

      default:
        throw new Error(`Unsupported resolution: '${resolution}'`);
    }
  }

  set(value: Date) {
    this._current = value;
    this.emit('change', this._current);
  }

  increment() {
    this._current = new Date(this._current.getTime() + this.stepMs);
    this.emit('change', this._current);
  }

  prevTick(size: number) {
    return new Date(this._current.getTime() - (this.stepMs * size));
  }
}