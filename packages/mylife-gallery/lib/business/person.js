'use strict';

const { createLogger, getStoreCollection, getMetadataEntity, notifyView, StoreContainer } = require('mylife-tools-server');
const business = require('.');

const logger = createLogger('mylife:gallery:business:person');

exports.personList = () => {
  const persons = getStoreCollection('persons');
  return persons.list();
};

exports.personGet = (id) => {
  const persons = getStoreCollection('persons');
  return persons.get(id);
};

exports.personIsThumbnailUsed = (thumbnailId) => {
  for(const person of getStoreCollection('persons')) {
    if(person.thumbnails.includes(thumbnailId)) {
      return true;
    }
  }

  return false;
};

exports.personCreate = personCreate;
function personCreate(values) {
  const entity = getMetadataEntity('person');
  const persons = getStoreCollection('persons');
  const newPerson = entity.newObject(values);

  const item = persons.set(newPerson);
  logger.info(`Created person '${item._id}'`);
  return item;
}

exports.personCreateFromDocuments = (firstName, lastName, documents) => {
  // take first image thumbnail
  const thumbnail = documents
    .map(ref => business.documentGet(ref.type, ref.id))
    .find(doc => doc._entity === 'image');
  const thumbnails = thumbnail ? [thumbnail] : thumbnail;

  const person = personCreate({ firstName, lastName, thumbnails });

  for(const { type, id } of documents) {
    const document = business.documentGet(type, id);
    business.documentAddPerson(document, person);
  }

  return person;
};

exports.personDelete = async (person) => {
  logger.info(`Deleting person '${person._id}'`);

  for(const document of business.documentListByPerson(person)) {
    business.documentRemovePerson(document, person);
  }

  const collection = getStoreCollection('persons');
  if(!collection.delete(person._id)) {
    throw new Error(`Cannot delete person '${person._id}' : document not found in collection`);
  }

  for(const thumbnailId of person.thumbnails) {
    await business.thumbnailRemoveIfUnused(thumbnailId);
  }
};

exports.personNotify = (session, id) => {
  const persons = getStoreCollection('persons');
  return notifyView(session, persons.createView(person => person._id === id));
};

exports.personsNotify = (session, criteria) => {
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
    parts.push(person => person.firstName && person.firstName.includes(criteria.firstName));
  }

  if(criteria.lastName) {
    parts.push(person => person.lastName && person.lastName.includes(criteria.lastName));
  }

  return person => parts.every(part => part(person));
}
