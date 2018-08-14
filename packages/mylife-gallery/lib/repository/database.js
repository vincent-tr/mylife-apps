'use strict';

module.exports = class Database {
  constructor() {
    this.items = [];
    this.ids = new Map();
  }

  addItem(item) {
    this.items.push(item);
    this.ids.set(item.id, item);
  }

  list() {
    return this.items;
  }

  get(id) {
    return this.ids.get(id);
  }
};