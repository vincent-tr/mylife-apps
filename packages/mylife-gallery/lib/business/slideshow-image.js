'use strict';

const { createLogger, notifyView, StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const business = require('.');

const logger = createLogger('mylife:gallery:business:slideshow-image');

exports.slideshowsImagesNotify = (session, criteria) => {
  const view = new SlideshowImageView();
  view.setCriteria(criteria);
  return notifyView(session, view);
};

class SlideshowImageView extends StoreContainer {
  constructor() {
    super();

    this.entity = getMetadataEntity('slidehow-mage');
    this._createSubscriptions();

    this._filterIds = new Set();
    this._slideshowsPerAlbum = new Map();
  }

  _createSubscriptions() {
    this.subscriptions = [];

    this.slideshows = getStoreCollection('slideshows');
    this.subscriptions.push(new business.CollectionSubscription(this, this.slideshows));

    this.albums = getStoreCollection('albums');
    this.subscriptions.push(new business.CollectionSubscription(this, this.albums));
  }

  close() {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  setCriteria(criteria) {
    logger.debug(`creating slideshows-images filter with criteria '${JSON.stringify(criteria)}'`);
    this._filterIds = new Set(criteria.slideshows || []);

    this.refresh();
  }

  refresh() {
    // TODO: remove slideshows not in filter ids
    for(const slideshowId of this._filterIds) {
      this._buildSlideshow(business.slideshowGet(slideshowId));
    }
  }

  onCollectionChange(collection, event) {
    if(collection === this.slideshows) {
      this._onSlideshowChange(event);
      return;
    }

    if(collection === this.albums) {
      this._onAlbumChange(event);
      return;
    }
  }

  _onSlideshowChange(event) {
    const slideshow = getEventObject(event);
    if(!this._filterIds.has(slideshow._id)) {
      return;
    }

    this._buildSlideshow(slideshow);
  }

  _onAlbumChange(event) {
    if(event.type !== 'create' && event.type !== 'update') {
      return;
    }

    const slideshows = this._slideshowsPerAlbum.get(event.after._id);
    if(!slideshows) {
      return;
    }

    for(const slideshowId of slideshows) {
      this._buildSlideshow(business.slideshowGet(slideshowId));
    }
  }

  _buildSlideshow(slideshow) {
    // TODO
    // TODO _slideshowsPerAlbum
    // TODO order

  }
}

function getEventObject({ before, after, type }) {
  switch(type) {
    case 'create':
    case 'update':
      return after;

    case 'remove':
      return before;

    default:
      throw new Error(`Unsupported event type: '${type}'`);
  }
}
