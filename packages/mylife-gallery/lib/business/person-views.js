'use strict';

const { createLogger, getStoreCollection, getMetadataEntity, notifyView, StoreContainer } = require('mylife-tools-server');
const business = require('.');

const logger = createLogger('mylife:gallery:business:person-views');

exports.personNotify = (session, id) => {
  const persons = getStoreCollection('persons');
  return notifyView(session, persons.createView(person => person._id === id));
};

exports.personsNotify = (session, criteria = {}) => {
  const view = new PersonView();
  view.setCriteria(criteria);
  return notifyView(session, view);
};


class PersonView extends StoreContainer {
  constructor() {
    super();

    this.entity = getMetadataEntity('person');
    this._createSubscriptions();
    this._criteria = {};
    this._filter = () => false; // will be set by setCriteria
  }

  _createSubscriptions() {
    this.collection = getStoreCollection('persons');
    this.subscription = new business.CollectionSubscription(this, this.collection);
  }

  close() {
    this.subscription.unsubscribe();
    this._reset();
  }

  setCriteria(criteria) {
    this._criteria = criteria;
    this._filter = buildFilter(this._criteria);
    this.refresh();
  }

  refresh() {
    for(const object of this.collection.list()) {
      this.onCollectionChange(this.collection, { type: 'update', before: object, after: object });
    }
  }

  onCollectionChange(collection, { before, after, type }) {
    switch(type) {
      case 'create': {
        if(this._filter(after)) {
          this._set(after);
        }
        break;
      }

      case 'update': {
        if(this._filter(after)) {
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

  const parts = [];

  if(criteria.firstName) {
    parts.push(person => person.firstName.includes(criteria.firstName));
  }

  if(criteria.lastName) {
    parts.push(person => person.lastName.includes(criteria.lastName));
  }

  return person => parts.every(part => part(person));
}
