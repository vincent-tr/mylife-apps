'use strict';

module.exports = class UniqueIndex {
  constructor(accessor) {
    this._map = new Map();
    this._accessor = accessor;
  }

  addItem(item) {
    const value = this._accessor(item);
    this._map.set(value, item);
  }

  removeItem(item) {
    const value = this._accessor(item);
    this._map.delete(value);
  }

  get(value) {
    return this._map.get(value);
  }

  keys() {
    return Array.from(this._map.keys());
  }
};