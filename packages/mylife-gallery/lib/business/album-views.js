'use strict';

const { createLogger, notifyView, StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const business = require('.');

const logger = createLogger('mylife:gallery:business:album-view');


exports.albumNotify = (session, id) => {
  const view = new AlbumView();
  view.setCriteria({ album: id });
  return notifyView(session, view);
};

exports.albumsNotify = (session, criteria) => {
  const view = new AlbumView();
  view.setCriteria(criteria);
  return notifyView(session, view);
};

class AlbumView extends StoreContainer {
  constructor() {
    super();

    this.entity = getMetadataEntity('album');
    this._createSubscriptions();
    this._criteria = {};
    this._filter = () => false; // will be set by setCriteria
  }

  _createSubscriptions() {
    this.subscriptions = [];
    this.collection = getStoreCollection('albums');
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
  logger.debug(`creating album filter with criteria '${JSON.stringify(criteria)}'`);

  const parts = [];

  if(criteria.album) {
    parts.push(album => album._id === criteria.album);
  }

  if(criteria.title) {
    parts.push(album => album.title && album.title.includes(criteria.title));
  }

  if(criteria.keywords) {
    const criteriaKeywords = criteria.keywords.split(/(\s+)/);
    parts.push(album => hasKeyword(album, criteriaKeywords));
  }

  return album => parts.every(part => part(album));
}

function hasKeyword(album, criteriaKeywords) {
  for(const albumKeyword of album.keywords) {
    for(const criteriaKeyword of criteriaKeywords) {
      if(albumKeyword.includes(criteriaKeyword)) {
        return true;
      }
    }
  }
  return false;
}
