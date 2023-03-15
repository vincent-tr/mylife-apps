import { Container } from './container';

export class View extends Container {
  private filterCallback;

  constructor(private readonly source: Container) {
    super(`view on ${source.name}`);

    this.source.on('change', this.onSourceChange);
  }


  setFilter(filterCallback) {
    this.filterCallback = filterCallback;
    this.refresh();
  }

  refresh() {
    for(const object of this.source.list()) {
      this.onSourceChange({ type: 'update', before: object, after: object });
    }
  }

  private readonly onSourceChange = ({ before, after, type }) => {
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
  };

  close() {
    this.source.off('change', this.onSourceChange);
    this._reset();
  }
};
