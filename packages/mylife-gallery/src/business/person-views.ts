import { createLogger, getStoreCollection, getMetadataEntity, notifyView, StoreContainer } from 'mylife-tools-server';
import * as business from '.';

const logger = createLogger('mylife:gallery:business:person-views');

export function personNotify(session, id) {
  const persons = getStoreCollection('persons');
  return notifyView(session, persons.createView(person => person._id === id));
}

export function personsNotify(session, criteria) {
  const view = new PersonView();
  view.setCriteria(criteria);
  return notifyView(session, view);
}

class PersonView extends StoreContainer {
  private readonly entity = getMetadataEntity('person');
  private collection;
  private subscription;
  private criteria;
  private filterPredicate;

  constructor() {
    super('person-view');

    this.entity = getMetadataEntity('person');
    this.createSubscriptions();
    this.criteria = {};
    this.filterPredicate = () => false; // will be set by setCriteria
  }

  private createSubscriptions() {
    this.collection = getStoreCollection('persons');
    this.subscription = new business.CollectionSubscription(this, this.collection, (event) => this.onCollectionChange(event));
  }

  close() {
    this.subscription.unsubscribe();
    this._reset();
  }

  setCriteria(criteria) {
    this.criteria = criteria;
    this.filterPredicate = buildFilter(this.criteria);
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
        if(this.filterPredicate(after)) {
          this._set(after);
        }
        break;
      }

      case 'update': {
        if(this.filterPredicate(after)) {
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
}

function buildFilter(criteria) {
  logger.debug(`creating person filter with criteria '${JSON.stringify(criteria)}'`);

  const parts: ((person) => boolean)[] = [];

  if(criteria.firstName) {
    parts.push(person => person.firstName.includes(criteria.firstName));
  }

  if(criteria.lastName) {
    parts.push(person => person.lastName.includes(criteria.lastName));
  }

  return person => parts.every(part => part(person));
}
