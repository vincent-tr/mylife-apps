'use strict';

module.exports = class Item {

  constructor(props) {
    this._properties = new Map();
    for(const [ key, value ] of Object.entries(props)) {
      this._properties.set(key, value);
    }
  }

  property(key) {
    return this._properties.get(key);
  }

  properties(keys) {
    const ret = {};
    for(const key of keys) {
      ret[key] = this.property(key);
    }
    return ret;
  }

  get id() {
    return this.property('id');
  }

  get mime() {
    return this.property('mime');
  }

  get content() {
    return this.property('content');
  }

  get thumbnail() {
    return this.property('thumbnail');
  }

  toJSON() {
    const ret = {};
    for(const [ key, value ] of this._properties) {
      ret[key] = value;
    }
    return ret;
  }
};