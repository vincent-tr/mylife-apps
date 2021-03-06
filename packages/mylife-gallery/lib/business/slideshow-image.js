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

    this.entity = getMetadataEntity('slideshow-image');
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
      this._buildSlideshow(slideshowId);
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
    const id = slideshow._id;
    if(!this._filterIds.has(id)) {
      return;
    }

    this._buildSlideshow(id);
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

  _buildSlideshow(id) {
    let data = this._slideshowsData.get(id);
    if(!data) {
      data = new SlideshowData(id);
      this._slideshowsData.set(id, data);
    }

    const [toDelete, toSet] = data.update(this._slideshowsPerAlbum);
    for(const objectId of toDelete) {
      this._delete(objectId);
    }

    for(const objectValues of toSet) {
      this._set(this.entity.newObject(objectValues));
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
    this._objects = new Set();
  }

  update(slideshowsPerAlbum) {
    const slideshow = business.slideshowFind(this._id);
    if(!slideshow) {
      // slideshow has been deleted but is still in criteria
      const deleted = this.delete(slideshowsPerAlbum);
      return [deleted, []];
    }

    const albumIds = slideshow.albums;

    this._updateAlbumsSet(slideshowsPerAlbum, albumIds);

    const imageIds = this._listImageIds(albumIds);
    const deleted = this._buildDeleted(imageIds);
    const added = this._buildAdded(imageIds);

    return [deleted, added];
  }

  _listImageIds(albumIds) {
    const imageIds = [];
    for(const albumId of albumIds) {
      const album = business.albumGet(albumId);
      for(const { type, id: documentId } of album.documents) {
        if(type !== 'image') {
          continue;
        }

        imageIds.push(documentId);
      }
    }
    return imageIds;
  }

  _buildAdded(imageIds) {
    const added = [];
    for(const [index, imageId] of imageIds.entries()) {
      const image = business.documentGet('image', imageId);
      const id = `${this._id}-${image._id}`;
      const objectValues = { _id: id, index, slideshow: this._id, thumbnail: image.thumbnail, image: image._id };
      added.push(objectValues);
      this._objects.add(id);
    }
    return added;
  }

  _buildDeleted(newImageIds) {
    const newSet = new Set(newImageIds.map(id => `${this._id}-${id}`));
    const deleted = [];
    for(const oldId of this._objects) {
      if(!newSet.has(oldId)) {
        deleted.push(oldId);
      }
    }

    for(const id of deleted) {
      this._objects.delete(id);
    }

    return deleted;
  }

  _updateAlbumsSet(slideshowsPerAlbum, newAlbumIds) {
    const newAlbumSet = new Set(newAlbumIds);

    // deleted albums
    const deletedAlbums = [];
    for(const id of this._albums) {
      if(!newAlbumSet.has(id)) {
        slideshowsPerAlbum.removeSlideshowAlbum(this._id, id);
        deletedAlbums.push(id);
      }
    }

    for(const id of deletedAlbums) {
      this._albums.delete(id);
    }

    // added albums
    for(const id of newAlbumSet) {
      if(!this._albums.has(id)) {
        this._albums.add(id);
        slideshowsPerAlbum.addSlideshowAlbum(this._id, id);
      }
    }
  }

  delete(slideshowsPerAlbum) {
    for(const albumId of this._albums) {
      slideshowsPerAlbum.removeSlideshowAlbum(this._id, albumId);
    }
    this._albums.clear();

    const objectIds = Array.from(this._objects);
    this._objects.clear();
    return objectIds;
  }

}
