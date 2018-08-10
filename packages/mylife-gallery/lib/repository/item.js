'use strict';

module.exports = class Item {

  constructor(props) {
    this.properties = new Map();
    for(const [ key, value ] of Object.entries(props)) {
      this.properties.set(key, value);
    }
  }

  property(key) {
    return this.properties.get(key);
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
};