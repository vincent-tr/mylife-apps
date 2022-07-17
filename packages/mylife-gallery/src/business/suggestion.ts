import { StoreContainer, StoreCollection, getMetadataEntity, notifyView, getStoreCollection } from 'mylife-tools-server';
import * as business from '.';

// root prefix for directories to do (not yet sorted into albums directories)
const ROOT_PREFIX_TODO = '_';
const SYNCING_MAX_DELAY = 1000 * 60 * 20; // 20 mins

export function suggestionsNotify(session) {
  const view = new SuggestionView();
  return notifyView(session, view);
}

export function suggestionCreateAlbum(root) {
  // select all documents with this root
  const documents = business.documentList().filter((doc) => doc.paths.some((path) => getRootPath(path) === root));
  documents.sort(documentDateComparer);

  const ids = documents.map((doc) => ({ id: doc._id, type: doc._entity }));

  // take 5 first images thumbnails
  const thumbnails = documents
    .filter((doc) => doc._entity === 'image')
    .slice(0, 5)
    .map((doc) => doc.thumbnail);

  business.albumCreate({ title: root, documents: ids, thumbnails });
}

export function suggestionCleanOthersList() {
  return business.getDocumentStoreCollection('other').list();
}

export function suggestionCleanDuplicatesList() {
  return business.documentList().filter((doc) => doc.paths.length > 1);
}

export function suggestionMoveSortedDocumentsList(albumId) {
  const album = business.albumGet(albumId);
  return album.documents
    .map((docref) => business.documentGet(docref.type, docref.id))
    .filter((document) => document.paths.some((fsItem) => fsItem.path.startsWith(ROOT_PREFIX_TODO)));
}

export function suggestionDeleteLoadingErrorsList() {
  return business.getDocumentStoreCollection('other').filter((doc) => doc.loadingError);
}

export async function suggestionDeleteLoadingErrors(ids) {
  const idSet = new Set(ids);
  const candidates = business
    .getDocumentStoreCollection('other')
    .filter((doc) => doc.loadingError) // only take allowed
    .filter((doc) => idSet.has(doc._id));

  for (const candidate of candidates) {
    await business.documentRemove(candidate);
  }

  return candidates.length;
}

export function suggestionDeleteEmptyAlbum(id) {
  // only delete it if empty
  const album = business.albumGet(id);
  if (album.documents.length > 0) {
    return false;
  }

  business.albumDelete(album);
  return true;
}

class SuggestionView extends StoreContainer {
  private entity;
  private subscriptions;
  private collections: { [name: string]: StoreCollection };
  private readonly listIntegrationRefreshTimer: NodeJS.Timer;
  private lastIntegration: Date;

  constructor() {
    super('suggestion-view');

    this.createSubscriptions();
    this.entity = getMetadataEntity('suggestion');
    this.onCollectionChange();

    this.listIntegrationRefreshTimer = setInterval(() => this.refreshWarnSyncing(), 1000);
  }

  private createSubscriptions() {
    this.subscriptions = [];
    this.collections = {};

    for (const collection of business.getDocumentStoreCollections()) {
      const subscription = new business.CollectionSubscription(this, collection);
      this.subscriptions.push(subscription);
      this.collections[collection.entity.id] = collection;
    }

    const albums = getStoreCollection('albums');
    const subscription = new business.CollectionSubscription(this, albums, () => this.onAlbumsChange());
    this.subscriptions.push(subscription);
  }

  close() {
    clearInterval(this.listIntegrationRefreshTimer);

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  refresh() {
    this.onCollectionChange();
    this.onAlbumsChange();
  }

  onCollectionChange() {
    this.lastIntegration = findLastIntegration();

    this.refreshWarnSyncing();
    this.refreshCleanOthers();
    this._refreshCleanDuplicates();
    this._refreshAlbumCreations();
    this.refreshDeleteLoadingErrors();
    this.refreshDocumentsWithoutAlbum();
    this.refreshSortDocumentRoots();
    this.refreshMoveSortedDocuments();
  }

  onAlbumsChange() {
    this._refreshAlbumCreations();
    this.refreshCleanEmptyAlbums();
    this.refreshDocumentsWithoutAlbum();
    this.refreshSortDocumentRoots();
    this.refreshMoveSortedDocuments();
  }

  private refreshWarnSyncing() {
    const now = new Date();
    const delay = now - this.lastIntegration;
    const show = delay < SYNCING_MAX_DELAY;

    if (show) {
      const lastIntegration = this.lastIntegration;
      this._set(this.entity.newObject({ _id: 'warn-syncing', type: 'warn-syncing', definition: { lastIntegration } }));
    } else {
      this._delete('warn-syncing');
    }
  }

  private refreshCleanOthers() {
    const count = this.collections['other'].size;
    if (count) {
      this._set(this.entity.newObject({ _id: 'clean-others', type: 'clean-others', definition: { count } }));
    } else {
      this._delete('clean-others');
    }
  }

  private _refreshCleanDuplicates() {
    let count = 0;
    let fileSizeSum = 0;
    for (const collection of Object.values(this.collections)) {
      for (const document of collection.list()) {
        if (document.paths.length > 1) {
          ++count;
          fileSizeSum += document.fileSize;
        }
      }
    }

    if (count) {
      this._set(this.entity.newObject({ _id: 'clean-duplicates', type: 'clean-duplicates', definition: { count, fileSizeSum } }));
    } else {
      this._delete('clean-duplicates');
    }
  }

  private _refreshAlbumCreations() {
    const documents = new Map();

    // map documents
    for (const collection of Object.values(this.collections)) {
      for (const document of collection.list()) {
        const type = document._entity;
        const id = document._id;
        documents.set(`${type}!${id}`, { type, id, roots: document.paths.map(getRootPath), hasAlbum: false });
      }
    }

    // set flag on document that have albums
    for (const album of getStoreCollection('albums').list()) {
      for (const docref of album.documents) {
        const document = documents.get(`${docref.type}!${docref.id}`);
        document.hasAlbum = true;
      }
    }

    // sort them by root directory
    const roots = new Map();
    for (const document of documents.values()) {
      for (const root of document.roots) {
        let list = roots.get(root);
        if (!list) {
          list = [];
          roots.set(root, list);
        }

        list.push(document);
      }
    }

    // select candidate roots
    const candidateRoots: { root; count; }[] = [];
    for (const [root, list] of roots.entries()) {
      if (root.startsWith(ROOT_PREFIX_TODO)) {
        continue;
      }

      const hasAlbum = list.some((document) => document.hasAlbum);
      if (!hasAlbum) {
        candidateRoots.push({ root, count: list.length });
      }
    }

    // remove outdates suggestions
    const rootSet = new Set(candidateRoots.map((candidate) => candidate.root));
    for (const suggestion of this.list()) {
      if (suggestion.type === 'album-creation' && !rootSet.has(suggestion.definition.root)) {
        this._delete(suggestion._id);
      }
    }

    // add/replace new suggestions
    for (const { root, count } of candidateRoots) {
      this._set(this.entity.newObject({ _id: `album-creation!${root}`, type: 'album-creation', definition: { root, count } }));
    }
  }

  private refreshDeleteLoadingErrors() {
    const count = this.collections['other'].filter((doc) => doc.loadingError).length;
    if (count) {
      this._set(this.entity.newObject({ _id: 'delete-loading-errors', type: 'delete-loading-errors', definition: { count } }));
    } else {
      this._delete('delete-loading-errors');
    }
  }

  private refreshCleanEmptyAlbums() {
    const emptyAlbums = getStoreCollection('albums').filter((album) => album.documents.length === 0);

    // remove outdates suggestions
    const idSet = new Set(emptyAlbums.map((album) => album._id));
    for (const suggestion of this.list()) {
      if (suggestion.type === 'clean-empty-album' && !idSet.has(suggestion.definition.id)) {
        this._delete(suggestion._id);
      }
    }

    // add/replace new suggestions
    for (const album of emptyAlbums) {
      const id = album._id;
      this._set(this.entity.newObject({ _id: `clean-empty-album!${id}`, type: 'clean-empty-album', definition: { id, title: album.title } }));
    }
  }

  private refreshDocumentsWithoutAlbum() {
    const documents = new Map();

    // map documents
    for (const collection of Object.values(this.collections)) {
      for (const document of collection.list()) {
        const type = document._entity;
        const id = document._id;
        documents.set(`${type}!${id}`, { type, id });
      }
    }

    // remove all documents that have album
    for (const album of getStoreCollection('albums').list()) {
      for (const docref of album.documents) {
        documents.delete(`${docref.type}!${docref.id}`);
      }
    }

    // show remaining
    const count = documents.size;
    if (count) {
      this._set(this.entity.newObject({ _id: 'documents-without-album', type: 'documents-without-album', definition: { count } }));
    } else {
      this._delete('documents-without-album');
    }
  }

  private refreshSortDocumentRoots() {
    // for each root, show
    // - x documents to sort (=without album)
    // - x documents to move (=with album)

    const documents = new Map();

    // map documents
    for (const collection of Object.values(this.collections)) {
      for (const document of collection.list()) {
        const type = document._entity;
        const id = document._id;
        documents.set(`${type}!${id}`, { type, id, roots: document.paths.map(getRootPath), hasAlbum: false });
      }
    }

    // set flag on document that have albums
    for (const album of getStoreCollection('albums').list()) {
      for (const docref of album.documents) {
        const document = documents.get(`${docref.type}!${docref.id}`);
        document.hasAlbum = true;
      }
    }

    // sort them by root directory
    const roots = new Map();
    for (const document of documents.values()) {
      for (const root of document.roots) {
        let list = roots.get(root);
        if (!list) {
          list = [];
          roots.set(root, list);
        }

        list.push(document);
      }
    }

    // select candidate roots
    const finalRoots = new Map();
    for (const [root, documents] of roots.entries()) {
      if (!root.startsWith(ROOT_PREFIX_TODO)) {
        continue;
      }

      let movableCount = 0;
      let sortableCount = 0;
      for (const { hasAlbum } of documents) {
        if (hasAlbum) {
          ++movableCount;
        } else {
          ++sortableCount;
        }
      }

      finalRoots.set(root, { movableCount, sortableCount });
    }

    // remove outdates suggestions
    for (const suggestion of this.list()) {
      if (suggestion.type === 'sort-document-root' && !finalRoots.get(suggestion.definition.root)) {
        this._delete(suggestion._id);
      }
    }

    // add/replace new suggestions
    for (const [root, counts] of finalRoots.entries()) {
      this._set(this.entity.newObject({ _id: `sort-document-root!${root}`, type: 'sort-document-root', definition: { root, ...counts } }));
    }
  }

  private refreshMoveSortedDocuments() {
    const albumsInfo = new Map();
    for (const album of getStoreCollection('albums').list()) {
      const sortableDocRefs = album.documents.filter((docref) => {
        const document = business.documentGet(docref.type, docref.id);
        return document.paths.some((fsItem) => fsItem.path.startsWith(ROOT_PREFIX_TODO));
      });

      const count = sortableDocRefs.length;
      if (count > 0) {
        const id = album._id;
        albumsInfo.set(id, { id, title: album.title, count });
      }
    }
    // remove outdates suggestions
    for (const suggestion of this.list()) {
      if (suggestion.type === 'move-sorted-documents' && !albumsInfo.get(suggestion.definition.id)) {
        this._delete(suggestion._id);
      }
    }

    // add/replace new suggestions
    for (const [id, definition] of albumsInfo.entries()) {
      this._set(this.entity.newObject({ _id: `move-sorted-documents!${id}`, type: 'move-sorted-documents', definition }));
    }
  }
}

function getRootPath(fsItem) {
  const { path } = fsItem;
  const index = path.indexOf('/');
  return index > -1 ? path.substr(0, index) : path;
}

function findLastIntegration() {
  const documents = business.documentList();
  const result = documents.reduce((acc, doc) => Math.max(acc, doc.integrationDate), -Infinity);
  return isFinite(result) ? new Date(result) : null;
}

function documentDateComparer(doc1, doc2) {
  if (!doc1.date && !doc2.date) {
    return 0; // Infinity - Infinity => NaN
  }

  const date1 = doc1.date || Infinity;
  const date2 = doc2.date || Infinity;
  return date1 - date2;
}
