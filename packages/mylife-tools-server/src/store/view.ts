import { Collection } from './collection';
import { Container } from './container';

export class View extends Container {
  private changeCallback;
  private filterCallback;

  constructor(private readonly collection: Collection) {
    super(`view on ${collection.name}`);

    this.changeCallback = event => this.onCollectionChange(event);
    this.collection.on('change', this.changeCallback);
  }

  setFilter(filterCallback) {
    this.filterCallback = filterCallback;
    this.refresh();
  }

  refresh() {
    for(const object of this.collection.list()) {
      this.onCollectionChange({ type: 'update', before: object, after: object });
    }
  }

  private onCollectionChange({ before, after, type }) {
    switch(type) {
      case 'create': {
        if(this.filterCallback(after)) {
          this._set(after);
        }
        break;
      }

      case 'update': {
        if(this.filterCallback(after)) {
          this._set(after);
        } else {
          this._delete(before._id);
        }
        break;
      }

      case 'remove': {
        this._delete(before._id);
        break;
      }


      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  }

  close() {
    this.collection.off('change', this.changeCallback);
    this._reset();
  }
};
