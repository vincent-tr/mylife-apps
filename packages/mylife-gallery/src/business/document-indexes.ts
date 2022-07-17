import { getStoreCollection } from 'mylife-tools-server';
import * as business from '.';

let documentIndexes;

export function documentIndexesInit() {
  documentIndexes = new DocumentIndexes();
}

export function documentIndexesTerminate() {
  documentIndexes.close();
  documentIndexes = null;
}

export function documentListAlbumsWithIndex(document) {
  return documentIndexes.listAlbums(document._id).map(({ albumId, albumIndex }) => ({ albumId, albumIndex }));
}

class DocumentIndexes {
  constructor() {

    this._itemsByAlbum = new Map();
    this._itemsByDocument = new Map();

    this.collection = getStoreCollection('albums');
    this.subscription = new business.CollectionSubscription(this, this.collection);

    this.refresh();
  }

  close() {
    this.subscription.unsubscribe();

    this._itemsByAlbum.clear();
    this._itemsByDocument.clear();
  }

  refresh() {
    this._itemsByAlbum.clear();
    this._itemsByDocument.clear();

    for(const object of this.collection.list()) {
      this.onCollectionChange(this.collection, { type: 'create', after: object });
    }
  }

  onCollectionChange(collection, { before, after, type }) {
    switch(type) {
      case 'create': {
        this._addAlbum(after);
        break;
      }

      case 'update': {
        if(before.documents === after.documents) {
          break;
        }

        this._removeAlbum(before);
        this._addAlbum(after);
        break;
      }

      case 'remove': {
        this._removeAlbum(before);
        break;
      }

      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  }

  _addAlbum(album) {
    for(const [index, ref] of album.documents.entries()) {
      this._addItem(ref, album._id, index);
    }
  }

  _removeAlbum(album) {
    for(const ref of album.documents) {
      this._removeItem(ref, album._id);
    }
  }

  _addItem(docRef, albumId, albumIndex) {
    const item = { docRef, albumId, albumIndex };

    const albumItems = getOrCreate(this._itemsByAlbum, albumId, () => new Map());
    albumItems.set(docRef.id, item);

    const documentItems = getOrCreate(this._itemsByDocument, docRef.id, () => new Map());
    documentItems.set(albumId, item);
  }

  _removeItem(docRef, albumId) {
    const albumItems = this._itemsByAlbum.get(albumId);
    albumItems.delete(docRef.id);
    if(albumItems.size === 0) {
      this._itemsByAlbum.delete(albumId);
    }

    const documentItems = this._itemsByDocument.get(docRef.id);
    documentItems.delete(albumId);
    if(documentItems.size === 0) {
      this._itemsByDocument.delete(docRef.id);
    }
  }

  listAlbums(docId) {
    const documentItems = this._itemsByDocument.get(docId);
    if(!documentItems) {
      return [];
    }

    return Array.from(documentItems.values());
  }
}

function getOrCreate(map, key, factory) {
  const existing = map.get(key);
  if(existing) {
    return existing;
  }

  const created = factory();
  map.set(key, created);
  return created;
}
