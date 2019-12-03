'use strict';

const { createLogger, notifyView, StoreContainer, getStoreCollection } = require('mylife-tools-server');
const business = require('.');

const logger = createLogger('mylife:gallery:business:document-view');

exports.documentNotify = (session, type, id) => {
  const collection = business.getDocumentStoreCollection(type);
  return notifyView(session, collection.createView(document => document._id === id));
};

exports.documentsNotify = (session, criteria) => {
  const view = new DocumentView();
  view.setCriteria(criteria);
  return notifyView(session, view);
};

class DocumentView extends StoreContainer {
  constructor() {
    super();
    this._createSubscriptions();
    this._filter = () => false; // will be set by _buildFilter
  }

  _createSubscriptions() {
    this.subscriptions = [];
    this.collections = {};

    for(const collection of business.getDocumentStoreCollections()) {
      const subscription = new business.CollectionSubscription(this, collection);
      this.subscriptions.push(subscription);
      this.collections[collection.entity.id] = collection;
    }

    // add subscription on albums to reset filtering on albums
    const albums = getStoreCollection('albums');
    const subscription = new business.CollectionSubscription(this, albums, () => this.refresh());
    this.subscriptions.push(subscription);
  }

  close() {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  setCriteria(criteria) {
    this._buildFilter(criteria);
    this.refresh();
  }

  refresh() {
    for(const collection of Object.values(this.collections)) {
      for(const object of collection.list()) {
        this.onCollectionChange(collection, { type: 'update', before: object, after: object });
      }
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

  _buildFilter(criteria) {
    logger.debug(`creating document filter with criteria '${JSON.stringify(criteria)}'`);

    const parts = [];

    if(criteria.minDate) {
      parts.push(document => document.date && document.date >= criteria.minDate);
    }

    if(criteria.maxDate) {
      parts.push(document => document.date && document.date <= criteria.maxDate);
    }

    if(criteria.minIntegrationDate) {
      parts.push(document => document.integrationDat && document.integrationDate >= criteria.minIntegrationDate);
    }

    if(criteria.maxIntegrationDate) {
      parts.push(document => document.integrationDat && document.integrationDate <= criteria.maxIntegrationDate);
    }

    if(criteria.type) {
      const types = new Set(criteria.type);
      parts.push(document => types.has(document._entity));
    }

    /*
    TODO:
      albums: new immutable.Set(),
      persons: new immutable.Set(),
    */

    if(criteria.keywords) {
      const criteriaKeywords = criteria.keywords.split(/(\s+)/);
      parts.push(document => hasKeyword(document, criteriaKeywords));
    }

    if(criteria.caption) {
      parts.push(document => document.caption && document.caption.includes(criteria.caption));
    }

    if(criteria.path) {
      parts.push(document => hasPath(document, criteria.path));
    }

    if(criteria.pathDuplicate) {
      parts.push(document => document.paths.length > 1);
    }

    this._filter = document => parts.every(part => part(document));
  }
}

function hasKeyword(document, criteriaKeywords) {
  for(const documentKeyword of document.keywords) {
    for(const criteriaKeyword of criteriaKeywords) {
      if(documentKeyword.includes(criteriaKeyword)) {
        return true;
      }
    }
  }
  return false;
}

function hasPath(document, criteriaPath) {
  for(const { path } of document.paths) {
    if(path.includes(criteriaPath)) {
      return true;
    }
  }
  return false;
}
