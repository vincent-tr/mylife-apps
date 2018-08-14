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

  removeItem(id) {
    const item = this.ids.get(id);
    this.ids.delete(id);
    this.items.splice(this.items.indexOf(item), 1);
  }

  list() {
    return this.items;
  }

  get(id) {
    return this.ids.get(id);
  }
};