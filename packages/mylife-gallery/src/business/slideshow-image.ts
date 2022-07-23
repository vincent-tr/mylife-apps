import { createLogger, notifyView, StoreContainer, getStoreCollection, getMetadataEntity } from 'mylife-tools-server';
import * as business from '.';

const logger = createLogger('mylife:gallery:business:slideshow-image');

export function slideshowsImagesNotify(session, criteria) {
  const view = new SlideshowImageView();
  view.setCriteria(criteria);
  return notifyView(session, view);
}

class SlideshowImageView extends StoreContainer {
  private readonly entity = getMetadataEntity('slideshow-image');
  private filterIds = new Set();
  private subscriptions;
  private slideshows;
  private albums;
  private readonly slideshowsPerAlbum = new SlideshowPerAlbum();
  private readonly slideshowsData = new Map();

  constructor() {
    super('slideshow-image-view');

    this.createSubscriptions();
  }

  private createSubscriptions() {
    this.subscriptions = [];

    this.slideshows = getStoreCollection('slideshows');
    this.subscriptions.push(new business.CollectionSubscription(this, this.slideshows, (event) => this.onSlideshowChange(event)));

    this.albums = getStoreCollection('albums');
    this.subscriptions.push(new business.CollectionSubscription(this, this.albums, (event) => this.onAlbumChange(event)));
  }

  close() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  setCriteria(criteria) {
    logger.debug(`creating slideshows-images filter with criteria '${JSON.stringify(criteria)}'`);
    this.filterIds = new Set(criteria.slideshows || []);

    this.refresh();
  }

  refresh() {
    const idsToRemove: string[] = [];
    for (const id of this.slideshowsData.keys()) {
      if (!this.filterIds.has(id)) {
        idsToRemove.push(id);
      }
    }

    for (const slideshowId of idsToRemove) {
      const data = this.slideshowsData.get(slideshowId);
      this.slideshowsData.delete(slideshowId);

      const toDelete = data.delete(this.slideshowsPerAlbum);
      for (const objectId of toDelete) {
        this._delete(objectId);
      }
    }

    for (const slideshowId of this.filterIds) {
      this.buildSlideshow(slideshowId);
    }
  }

  private onSlideshowChange(event) {
    const slideshow = getEventObject(event);
    const id = slideshow._id;
    if (!this.filterIds.has(id)) {
      return;
    }

    this.buildSlideshow(id);
  }

  private onAlbumChange(event) {
    if (event.type !== 'create' && event.type !== 'update') {
      return;
    }

    const slideshows = this.slideshowsPerAlbum.getSlideshows(event.after._id);
    for (const slideshowId of slideshows) {
      this.buildSlideshow(business.slideshowGet(slideshowId));
    }
  }

  private buildSlideshow(id) {
    let data = this.slideshowsData.get(id);
    if (!data) {
      data = new SlideshowData(id);
      this.slideshowsData.set(id, data);
    }

    const [toDelete, toSet] = data.update(this.slideshowsPerAlbum);
    for (const objectId of toDelete) {
      this._delete(objectId);
    }

    for (const objectValues of toSet) {
      this._set(this.entity.newObject(objectValues));
    }
  }
}

function getEventObject({ before, after, type }) {
  switch (type) {
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
  private readonly map = new Map();
  private readonly empty = new Set();

  getSlideshows(albumId) {
    return this.map.get(albumId) || this.empty;
  }

  addSlideshowAlbum(slideshowId, albumId) {
    let set = this.map.get(slideshowId);
    if (!set) {
      set = new Set();
      this.map.set(slideshowId, set);
    }

    set.add(albumId);
  }

  removeSlideshowAlbum(slideshowId, albumId) {
    const set = this.map.get(slideshowId);
    set.delete(albumId);
    if (!set.size) {
      this.map.delete(slideshowId);
    }
  }
}

class SlideshowData {
  private readonly albums = new Set<string>();
  private readonly objects = new Set<string>();

  constructor(private readonly id) {}

  update(slideshowsPerAlbum) {
    const slideshow = business.slideshowFind(this.id);
    if (!slideshow) {
      // slideshow has been deleted but is still in criteria
      const deleted = this.delete(slideshowsPerAlbum);
      return [deleted, []];
    }

    const albumIds = slideshow.albums;

    this.updateAlbumsSet(slideshowsPerAlbum, albumIds);

    const imageIds = this.listImageIds(albumIds);
    const deleted = this.buildDeleted(imageIds);
    const added = this.buildAdded(imageIds);

    return [deleted, added];
  }

  private listImageIds(albumIds) {
    const imageIds: string[] = [];
    for (const albumId of albumIds) {
      const album = business.albumGet(albumId);
      for (const { type, id: documentId } of album.documents) {
        if (type !== 'image') {
          continue;
        }

        imageIds.push(documentId);
      }
    }
    return imageIds;
  }

  private buildAdded(imageIds) {
    const added: { _id; index; slideshow; thumbnail; image }[] = [];
    for (const [index, imageId] of imageIds.entries()) {
      const image = business.documentGet('image', imageId);
      const id = `${this.id}-${image._id}`;
      const objectValues = { _id: id, index, slideshow: this.id, thumbnail: image.thumbnail, image: image._id };
      added.push(objectValues);
      this.objects.add(id);
    }
    return added;
  }

  private buildDeleted(newImageIds) {
    const newSet = new Set(newImageIds.map((id) => `${this.id}-${id}`));
    const deleted: string[] = [];
    for (const oldId of this.objects) {
      if (!newSet.has(oldId)) {
        deleted.push(oldId);
      }
    }

    for (const id of deleted) {
      this.objects.delete(id);
    }

    return deleted;
  }

  private updateAlbumsSet(slideshowsPerAlbum, newAlbumIds: string[]) {
    const newAlbumSet = new Set(newAlbumIds);

    // deleted albums
    const deletedAlbums: string[] = [];
    for (const id of this.albums) {
      if (!newAlbumSet.has(id)) {
        slideshowsPerAlbum.removeSlideshowAlbum(this.id, id);
        deletedAlbums.push(id);
      }
    }

    for (const id of deletedAlbums) {
      this.albums.delete(id);
    }

    // added albums
    for (const id of newAlbumSet) {
      if (!this.albums.has(id)) {
        this.albums.add(id);
        slideshowsPerAlbum.addSlideshowAlbum(this.id, id);
      }
    }
  }

  delete(slideshowsPerAlbum) {
    for (const albumId of this.albums) {
      slideshowsPerAlbum.removeSlideshowAlbum(this.id, albumId);
    }
    this.albums.clear();

    const objectIds = Array.from(this.objects);
    this.objects.clear();
    return objectIds;
  }
}
