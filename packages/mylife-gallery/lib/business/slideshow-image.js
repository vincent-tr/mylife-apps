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

    const before = getAlbums(event.before);
    const after = getAlbums(event.after);
    const [deleted, added] = diff(before, after);

    for(const albumId of deleted) {
      const album = business.albumGet(albumId);
      this._onAlbumRemove(slideshow._id, album);
    }

    for(const albumId of added) {
      const album = business.albumGet(albumId);
      this._onAlbumAdd(slideshow._id, album);
    }
  }

  _onAlbumChange(event) {
    if(event.type !== 'create' && event.type !== 'update') {
      return;
    }

    const album = getEventObject(event);
    const slideshows = this._slideshowsPerAlbum.get(album._id);
    if(!slideshows) {
      return;
    }

    const before = getDocuments(event.before);
    const after = getDocuments(event.after);
    const [deleted, added] = diff(before, after);
    for(const slideshowId of slideshows) {
      this._onAlbumUpdate(slideshowId, deleted, added);
    }
  }

  _onAlbumAdd(slideshowId, album) {
    // TODO
    // TODO _slideshowsPerAlbum
    // TODO order
  }

  _onAlbumRemove(slideshowId, album) {
    // TODO
    // TODO _slideshowsPerAlbum
    // TODO order
  }

  _onAlbumUpdate(slideshowId, deleted, added) {
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

function getAlbums(slideshow) {
  if(!slideshow) {
    return [];
  }

  return slideshow.albums;
}

function getDocuments(album) {
  if(!album) {
    return [];
  }

  return album.documents
    .filter(ref => ref.type === 'image')
    .map(ref =>ref .id);
}

function diff(before, after) {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  const deleted = [];
  const added = [];

  for(const item of beforeSet) {
    if(!afterSet.has(item)) {
      deleted.push(item);
    }
  }


  for(const item of afterSet) {
    if(!beforeSet.has(item)) {
      added.push(item);
    }
  }

  return { deleted, added };
}
