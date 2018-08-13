'use strict';

const Item = require('./item');

module.exports = class Database {
  constructor() {
    this.items = [];
    this.ids = new Map();
  }

  addItem(props) {
    const item = new Item(props);
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