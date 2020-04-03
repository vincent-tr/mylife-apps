import EventEmitter from 'events';
import { createLogger } from 'mylife-tools-server';
import { last, average, round } from '../../utils';

const logger = createLogger('mylife:trading:broker:moving-dataset');

export class CandleStickData {
  constructor(readonly open: number, readonly close: number, readonly high: number, readonly low: number) {
  }
}

export class Record {
  private _partial: boolean = true;
  private _average: CandleStickData;

  constructor(readonly ask: CandleStickData, readonly bid: CandleStickData, readonly timestamp: Date) {
  }

  isSameTimestamp(other: Record) {
    return this.timestamp.valueOf() === other.timestamp.valueOf();
  }

  get average() {
    if (!this._average) {
      this._average = new CandleStickData(roundedAverage(this.ask.open, this.bid.open), roundedAverage(this.ask.close, this.bid.close), roundedAverage(this.ask.high, this.bid.high), roundedAverage(this.ask.low, this.bid.low));
    }
    return this._average;
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
    return last(this.list);
  }

  add(record: Record) {

    const lastIndex = this.list.length - 1;
    const lastItem = lastIndex > -1 ? this.list[lastIndex] : null;

    // is it an update of the last record or a new record ? let's compare timestamps
    const isUpdate = lastItem && lastItem.isSameTimestamp(record);
    if (isUpdate) {
      this.list[lastIndex] = record;
      this.emit('update', record);
      return;
    }

    lastItem?.fix();

    if (lastItem) {
      logger.debug(`Record fixed: '${JSON.stringify(lastItem)}'`);
    }

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

function roundedAverage(...values: number[]) {
  return round(average(...values), 5);
}