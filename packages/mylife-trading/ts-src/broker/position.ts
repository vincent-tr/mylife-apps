import EventEmitter from 'events';

declare interface Position {
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'close', listener: () => void): this;
}

class Position extends EventEmitter {
  constructor() {
    super();
  }

  async update() {
    
  }

  async close() {
  }
}

export default Position;