'use strict';

const albums = require('./albums');
const images = require('./images');

exports.sync = async function() {
  const { add, remove, keep } = await albums.diff();

  for(const name of remove) {
    await albums.delete(name);
  }
  for(const name of keep) {
    const album = await albums.update(name);
    await syncAlbum(album);
  }
  for(const name of add) {
    const album = await albums.create(name);
    await syncAlbum(album);
  }
};

async function syncAlbum(album) {
  const { add, remove } = await images.diff(album);

  for(const ipath of remove) {
    await images.delete(album, ipath);
  }
  for(const ipath of add) {
    await images.create(album, ipath);
  }
}