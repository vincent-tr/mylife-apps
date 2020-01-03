'use strict';

const { StoreContainer, getMetadataEntity, notifyView, getStoreCollection } = require('mylife-tools-server');
const business = require('.');

exports.suggestionsNotify = session => {
  const view = new SuggestionView();
  return notifyView(session, view);
};

exports.suggestionCreateAlbum = root => {
  // select all documents with this root
  const ids = [];
  for(const document of business.documentList()) {
    if(!document.paths.some(path => getRootPath(path) === root)) {
      continue;
    }

    ids.push({ id: document._id, type: document._entity });
  }

  business.albumCreate({ title: root, documents: ids });
};

class SuggestionView extends StoreContainer {
  constructor() {
    super();

    this._createSubscriptions();
    this.entity = getMetadataEntity('suggestion');
    this.onCollectionChange();

    this._listIntegrationRefreshTimer = setInterval(() => this._refreshWarnSyncing(), 1000);
  }

  _createSubscriptions() {
    this.subscriptions = [];
    this.collections = {};

    for(const collection of business.getDocumentStoreCollections()) {
      const subscription = new business.CollectionSubscription(this, collection);
      this.subscriptions.push(subscription);
      this.collections[collection.entity.id] = collection;
    }

    const albums = getStoreCollection('albums');
    const subscription = new business.CollectionSubscription(this, albums, () => this._refreshAlbumCreations());
    this.subscriptions.push(subscription);
  }

  close() {
    clearInterval(this._listIntegrationRefreshTimer);

    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  refresh() {
    this.onCollectionChange();
  }

  onCollectionChange() {
    this._lastIntegration = findLastIntegration();
    this._refreshWarnSyncing();
    this._refreshCleanOthers();
    this._refreshCleanDuplicates();
    this._refreshAlbumCreations();
  }

  _refreshWarnSyncing() {
    const TIMEOUT = 1000 * 60 * 20; // 20 mins
    const now = new Date();
    const delay = now - this._lastIntegration;
    const show = delay < TIMEOUT;

    if(show) {
      this._set(this.entity.newObject({ _id: 'warn-syncing', type: 'warn-syncing', definition: { delay } }));
    } else {
      this._delete('warn-syncing');
    }
  }

  _refreshCleanOthers() {
    const count = this.collections['other'].size;
    if(count) {
      this._set(this.entity.newObject({ _id: 'clean-others', type: 'clean-others', definition: { count } }));
    } else {
      this._delete('clean-others');
    }
  }

  _refreshCleanDuplicates() {
    let count = 0;
    for(const collection of Object.values(this.collections)) {
      for(const document of collection.list()) {
        if(document.paths.length > 1) {
          ++count;
        }
      }
    }

    if(count) {
      this._set(this.entity.newObject({ _id: 'clean-duplicates', type: 'clean-duplicates', definition: { count } }));
    } else {
      this._delete('clean-duplicates');
    }
  }

  _refreshAlbumCreations() {
    const documents = new Map();

    // map documents
    for(const collection of Object.values(this.collections)) {
      for(const document of collection.list()) {
        const type = document._entity;
        const id = document._id;
        documents.set(`${type}!${id}`, { type, id, roots: document.paths.map(getRootPath), hasAlbum: false });
      }
    }

    // set flag on document that have albums
    for(const album of getStoreCollection('albums').list()) {
      for(const docref of album.documents) {
        const document = documents.get(`${docref.type}!${docref.id}`);
        document.hasAlbum = true;
      }
    }

    // sort them by root directory
    const roots = new Map();
    for(const document of documents.values()) {
      for(const root of document.roots) {
        let list = roots.get(root);
        if(!list) {
          list = [];
          roots.set(root, list);
        }

        list.push(document);
      }
    }

    // select candidate roots
    const candidateRoots = [];
    for(const [root, list] of roots.entries()) {
      const hasAlbum = list.some(document => document.hasAlbum);
      if(!hasAlbum) {
        candidateRoots.push({ root, count: list.length });
      }
    }

    // remove outdates suggestions
    const rootSet = new Set(candidateRoots.map(candidate => candidate.root));
    for(const suggestion of this.list()) {
      if(suggestion.type === 'album-creation' && !rootSet.has(suggestion.definition.root)) {
        this._delete(suggestion._id);
      }
    }

    // add new suggestions
    for(const { root, count } of candidateRoots) {
      this._set(this.entity.newObject({ _id: `album-creation!${root}`, type: 'album-creation', definition: { root, count } }));
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
