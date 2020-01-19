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
    this._slideshowsPerAlbum.clear();
    // TODO
  }

  onCollectionChange(collection, event) {
    if(collection === this.slideshows) {
      const slideshow = getEventObject(event);
      if(!this._filterIds.has(slideshow._id)) {
        return;
      }

      const before = event.before ? event.before.albums : [];
      const after = event.after ? event.after.albums : [];
      const [deleted, added] = diff(before, after);

      for(const albumId of deleted) {
        const album = business.albumGet(albumId);
        this._onAlbumRemove(slideshow, album);
      }

      for(const albumId of added) {
        const album = business.albumGet(albumId);
        this._onAlbumAdd(slideshow, album);
      }
    }

    if(collection === this.albums) {
      const album = getEventObject(event);
      // TODO
    }
  }

  _onAlbumAdd(slideshow, album) {
    // TODO
  }

  _onAlbumRemove(slideshow, album) {
    // TODO
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

function diff(before, after) {

}
