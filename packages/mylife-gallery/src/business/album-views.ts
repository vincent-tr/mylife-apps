import { createLogger, notifyView, StoreContainer, getStoreCollection, getMetadataEntity } from 'mylife-tools-server';
import * as business from '.';

const logger = createLogger('mylife:gallery:business:album-view');

export function albumNotify(session, id) {
  const view = new AlbumView();
  view.setCriteria({ album: id });
  return notifyView(session, view);
}

export function albumsNotify(session, criteria) {
  const view = new AlbumView();
  view.setCriteria(criteria);
  return notifyView(session, view);
}

class AlbumView extends StoreContainer {
  private readonly entity;
  private criteria;
  private filterPredicate;
  private subscriptions;
  private collection;
  
  constructor() {
    super('album-view');

    this.entity = getMetadataEntity('album');
    this.createSubscriptions();
    this.criteria = {};
    this.filterPredicate = () => false; // will be set by setCriteria
  }

  private createSubscriptions() {
    this.subscriptions = [];
    this.collection = getStoreCollection('albums');
    this.subscriptions.push(new business.CollectionSubscription(this, this.collection, (event) => this.onCollectionChange(event)));

    // add subscription on slideshows to reset filtering on slideshows
    const slideshows = getStoreCollection('slideshows');
    const subscription = new business.CollectionSubscription(this, slideshows, () => this.rebuildFilter()); // need to rebuild criteria to have proper slideshows buckets
    this.subscriptions.push(subscription);
  }

  close() {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  setCriteria(criteria) {
    this.criteria = criteria;
    this.rebuildFilter();
  }

  private rebuildFilter() {
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
  logger.debug(`creating album filter with criteria '${JSON.stringify(criteria)}'`);

  const parts: ((album) => boolean)[] = [];

  if(criteria.album) {
    parts.push(album => album._id === criteria.album);
  }

  if(criteria.slideshow) {
    const slideshow = business.slideshowGet(criteria.slideshow);
    const ids = new Set(slideshow.albums);
    parts.push(album => ids.has(album._id));
  }

  if(criteria.title) {
    parts.push(album => album.title.includes(criteria.title));
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
