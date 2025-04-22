import { StoreMaterializedView, StoreCollection, StorePartitionIndex, getStoreCollection, getMetadataEntity } from 'mylife-tools-server';
import { dateToMonth, roundCurrency, monthRange } from './tools';

export class TotalByMonth extends StoreMaterializedView {
  private readonly collection: StoreCollection;

  constructor() {
    super('total-by-month', getMetadataEntity('report-total-by-month'));
    this.collection = getStoreCollection('operations');
    this.collection.on('change', this.onCollectionChange);

    this.init();
  }

  close() {
    this.collection.off('change', this.onCollectionChange);
    this._reset();
  }

  private init() {
    for (const month of getMonthList()) {
      this.computeBucket(month);
    }
  }

  private readonly onCollectionChange = ({ before, after, type }) => {
    const months = getMonthList();

    switch(type) {
      case 'create': {
        const month = dateToMonth(after.date);

        if (months.has(month)) {
          this.computeBucket(month);
        }

        break;
      }
  
      case 'update': {
        const month1 = dateToMonth(before.date);
        const month2 = dateToMonth(after.date);

        // should be useless since amount cannot change
        if (months.has(month1)) {
          this.computeBucket(month1);
        }

        if (month1 !== month2 && months.has(month2)) {
          // should not happen since date cannot change
          this.computeBucket(month2);
        }

        break;
      }
  
      case 'remove': {
        // should not happen since operations cannot be removed
        const month = dateToMonth(before.date);

        if (months.has(month)) {
          this.computeBucket(month);
        }

        break;
      }
  
      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }

    this.cleanOldBuckets(months);
  };

  private computeBucket(month: string) {
    const index = this.collection.getIndex('partition-by-month') as StorePartitionIndex;
    const partition = index.findPartition(month) || new Set();

    const object = {
      _id: month,
      month,
      count: 0,
      sumDebit: 0,
      sumCredit: 0,
      balance: 0
    };

    for (const operation of partition) {
      ++object.count;
      operation.amount < 0 ? (object.sumDebit += -operation.amount) : (object.sumCredit += operation.amount);
      object.balance += operation.amount;
    }

    object.sumDebit = roundCurrency(object.sumDebit);
    object.sumCredit = roundCurrency(object.sumCredit);
    object.balance = roundCurrency(object.balance);

    this._set(this.entity.newObject(object));
  }

  private cleanOldBuckets(months: Set<string>) {
    for (const object of this.list()) {
      if (!months.has(object._id)) {
        this._delete(object._id);
      }
    }
  }
}

function getMonthList() {
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 1, 0, 1);
  return new Set(monthRange(minDate, now));
}