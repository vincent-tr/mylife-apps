'use strict';

module.exports = class Index {
  constructor(accessor) {
    this._map = new Map();
    this._accessor = accessor;
  }

  addItem(item) {
    const value = this._accessor(item);
    const list = mapList(this._map, value);
    list.push(item);
  }

  removeItem(item) {
    const value = this._accessor(item);
    const list = this._map.get(value);
    list.splice(list.indexOf(item), 1);
    if(!list.length) {
      this._map.delete(value);
    }
  }

  get(value) {
    return this._map.get(value);
  }

  keys() {
    return Array.from(this._map.keys());
  }
};

function mapList(map, value) {
  const existing = map.get(value);
  if(existing) {
    return existing;
  }
  const created = [];
  map.set(value, created);
  return created;
}