import EventEmitter from 'events';

export class CandleStickData {
  constructor(readonly open: number, readonly close: number, readonly high: number, readonly low: number) {
  }
}

export class Record {
  private _partial: boolean = true;

  constructor(readonly ask: CandleStickData, readonly bid: CandleStickData, readonly timestamp: Date) {
  }

  isSameTimestamp(other: Record) {
    return this.timestamp.valueOf() === other.timestamp.valueOf();
  }

  get partial() {
    return this._partial;
  }

  get fixed() {
    return !this._partial;
  }

  fix() {
    this._partial = false;
  }
}

declare interface MovingDataset {
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'add', listener: (record: Record) => void): this;
  on(event: 'update', listener: (record: Record) => void): this;
  on(event: 'close', listener: () => void): this;
}

class MovingDataset extends EventEmitter {
  readonly list: Record[] = [];

  constructor(private readonly maxSize: number) {
    super();
  }

  get fixedList() {
    return this.list.filter(record => record.fixed);
  }

  get last() {
    const lastIndex = this.list.length - 1;
    return  lastIndex > -1 ? this.list[lastIndex] : null;
  }

  add(record: Record) {

    const lastIndex = this.list.length - 1;
    const lastItem = lastIndex > -1 ? this.list[lastIndex] : null;

    // is it an update of the last record or a new record ? let's compare timestamps
    const isUpdate = lastItem && lastItem.isSameTimestamp(record);
    if(isUpdate) {
      this.list[lastIndex] = record;
      this.emit('update', record);
      return;
    }

    lastItem?.fix();

    this.list.push(record);

    if (this.list.length > this.maxSize) {
      this.list.shift();
    }

    this.emit('add', record);
  }

  close() {
    this.emit('close');
  }
}

export default MovingDataset;