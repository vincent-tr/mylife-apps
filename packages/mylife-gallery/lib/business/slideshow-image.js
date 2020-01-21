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
    this._slideshowsPerAlbum = new SlideshowPerAlbum();
    this._slideshowsData = new Map();
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
    const idsToRemove = [];
    for(const id of this._slideshowsData.keys()) {
      if(!this._filterIds.has(id)) {
        idsToRemove.push(id);
      }
    }

    for(const slideshowId of idsToRemove) {
      const data = this._slideshowsData.get(slideshowId);
      this._slideshowsData.delete(slideshowId);

      const toDelete = data.delete(this._slideshowsPerAlbum);
      for(const objectId of toDelete) {
        this._delete(objectId);
      }
    }

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

    const slideshows = this._slideshowsPerAlbum.getSlideshows(event.after._id);
    for(const slideshowId of slideshows) {
      this._buildSlideshow(business.slideshowGet(slideshowId));
    }
  }

  _buildSlideshow(slideshow) {
    const id = slideshow._id;
    let data = this._slideshowsData.get(id);
    if(!data) {
      data = new SlideshowData(id);
      this._slideshowsData.set(id, data);
    }

    const [toDelete, toSet] = data.update(slideshow, this._slideshowsPerAlbum);
    for(const objectId of toDelete) {
      this._delete(objectId);
    }

    for(const object of toSet) {
      this._set(object);
    }
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

class SlideshowPerAlbum {
  constructor() {
    this.map = new Map();
    this.empty = new Set();
  }

  clear() {
    this.map.clear();
  }

  getSlideshows(albumId) {
    return this.map.get(albumId) || this.empty;
  }

  addSlideshowAlbum(slideshowId, albumId) {
    let set = this.map.get(slideshowId);
    if(!set) {
      set = new Set();
      this.map.set(slideshowId, set);
    }

    set.add(albumId);
  }

  removeSlideshowAlbum(slideshowId, albumId) {
    const set = this.map.get(slideshowId);
    set.delete(albumId);
    if(!set.size) {
      this.map.delete(slideshowId);
    }
  }
}

class SlideshowData {
  constructor(id) {
    this._id = id;
    this._albums = new Set();
    this._objects = new Map();
  }

  update(slideshow, slideshowsPerAlbum) {
    // TODO
    // TODO _slideshowsPerAlbum
    // TODO order

  }

  delete(slideshowsPerAlbum) {
    for(const albumId of this._albums) {
      slideshowsPerAlbum.removeSlideshowAlbum(this._id, albumId);
    }

    const objectIds = Array.from(this._objects.keys());
    this._objects.clear();
    return objectIds;
  }

}
