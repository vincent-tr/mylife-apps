'use strict';

const data     = require('./data');
const CRUDBase = require('./crud-base');

exports.albums = new class Albums extends CRUDBase {
  constructor() {
    super('albums');
  }

  async getByName(name) {
    const [ object ] = await data.find(this.name, { name });
    return object;
  }

  async list() {
    return await data.find(this.name, {});
  }
};

exports.images = new class Images extends CRUDBase {
  constructor() {
    super('images');
  }

  async listByAlbum(id) {
    return await data.find(this.name, { album: data.wrapObjectID(id) });
  }

  async getByPath(ipath) {
    const [ object ] = await data.find(this.name, { ipath });
    return object;
  }

  async getByIId(iid) {
    const [ object ] = await data.find(this.name, { iid });
    return object;
  }
};

exports.thumbnails = new class Thumbnails extends CRUDBase {
  constructor() {
    super('thumbnails');
  }

  async getByIId(iid) {
    const [ object ] = await data.find(this.name, { iid });
    return object;
  }

  async listByMultipleIIds(iids) {
    return await data.find(this.name, { iid : { $in : iids }});
  }

  // prefetchAlbum ?
};

exports.wrapBinary = function wrapBinary(buffer) {
  return data.wrapBinary(buffer);
};

exports.unwrapBinary = function unwrapBinary(binary) {
  return data.unwrapBinary(binary);
};