'use strict';

const data     = require('./data');
const CRUDBase = require('./crud-base');

exports.albums = new class Albums extends CRUDBase {
  constructor() {
    super('albums');
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
};

exports.thumbnails = new class Thumbnails extends CRUDBase {
  constructor() {
    super('thumbnails');
  }

  // prefetchAlbum ?
};

exports.close = async function close() {
  await data.close();
};