'use strict';

const ListIndex   = require('./list-index');
const MultiIndex  = require('./multi-index');
const UniqueIndex = require('./unique-index');

module.exports = class Database {
  constructor() {
    this._indexes = {
      list  : new ListIndex(),
      id    : new UniqueIndex(item => item.id),
      album : new MultiIndex(item => item.metadata.album)
    };
  }

  addItem(item) {
    for(const index of Object.values(this._indexes)) {
      index.addItem(item);
    }
  }

  removeItem(id) {
    const item = this.get(id);
    for(const index of Object.values(this._indexes)) {
      index.removeItem(item);
    }
  }

  list() {
    return this._indexes.list.list();
  }

  get(id) {
    return this._indexes.id.get(id);
  }

  albums() {
    return this._indexes.album.keys();
  }

  album(value) {
    return this._indexes.album.get(value);
  }
};