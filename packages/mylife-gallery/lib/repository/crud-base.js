'use strict';

const data = require('./data');

module.exports = class CRUDBase {
  constructor(name) {
    this.name = name;
  }

  async get(id) {
    return await data.get(this.name, id);
  }

  async set(object) {
    return await data.set(this.name, object);
  }

  async delete(id) {
    return await data.delete(this.name, id);
  }
};