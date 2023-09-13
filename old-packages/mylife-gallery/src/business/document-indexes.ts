import { getStoreCollection, StoreEvent } from 'mylife-tools-server';
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
  private readonly itemsByAlbum = new Map();
  private readonly itemsByDocument = new Map();
  private readonly collection = getStoreCollection('albums');
  private readonly subscription;

  constructor() {
    this.subscription = new business.CollectionSubscription(this, this.collection, (event) => this.onCollectionChange(event));

    this.refresh();
  }

  close() {
    this.subscription.unsubscribe();

    this.itemsByAlbum.clear();
    this.itemsByDocument.clear();
  }

  refresh() {
    this.itemsByAlbum.clear();
    this.itemsByDocument.clear();

    for (const object of this.collection.list()) {
      this.onCollectionChange({ type: 'create', after: object });
    }
  }

  private onCollectionChange({ before, after, type }: StoreEvent) {
    switch (type) {
      case 'create': {
        this.addAlbum(after);
        break;
      }

      case 'update': {
        if (before.documents === after.documents) {
          break;
        }

        this.removeAlbum(before);
        this.addAlbum(after);
        break;
      }

      case 'remove': {
        this.removeAlbum(before);
        break;
      }

      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  }

  private addAlbum(album) {
    for (const [index, ref] of album.documents.entries()) {
      this.addItem(ref, album._id, index);
    }
  }

  private removeAlbum(album) {
    for (const ref of album.documents) {
      this.removeItem(ref, album._id);
    }
  }

  private addItem(docRef, albumId, albumIndex) {
    const item = { docRef, albumId, albumIndex };

    const albumItems = getOrCreate(this.itemsByAlbum, albumId, () => new Map());
    albumItems.set(docRef.id, item);

    const documentItems = getOrCreate(this.itemsByDocument, docRef.id, () => new Map());
    documentItems.set(albumId, item);
  }

  private removeItem(docRef, albumId) {
    const albumItems = this.itemsByAlbum.get(albumId);
    albumItems.delete(docRef.id);
    if (albumItems.size === 0) {
      this.itemsByAlbum.delete(albumId);
    }

    const documentItems = this.itemsByDocument.get(docRef.id);
    documentItems.delete(albumId);
    if (documentItems.size === 0) {
      this.itemsByDocument.delete(docRef.id);
    }
  }

  listAlbums(docId) {
    const documentItems = this.itemsByDocument.get(docId);
    if (!documentItems) {
      return [];
    }

    return Array.from(documentItems.values());
  }
}

function getOrCreate(map, key, factory) {
  const existing = map.get(key);
  if (existing) {
    return existing;
  }

  const created = factory();
  map.set(key, created);
  return created;
}
