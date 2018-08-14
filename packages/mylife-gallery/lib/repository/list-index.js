'use strict';

module.exports = class ListIndex {
  constructor() {
    this._items = [];
  }

  addItem(item) {
    this._items.push(item);
  }

  removeItem(item) {
    this._items.splice(this._items.indexOf(item), 1);
  }

  list() {
    return this._items;
  }
};