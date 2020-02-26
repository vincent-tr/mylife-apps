import EventEmitter from 'events';

declare interface MovingDataset {
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'close', listener: () => void): this;
}

export default class Position extends EventEmitter {
  constructor() {
    super();
  }

  async update() {
    
  }

  async close() {
  }
}