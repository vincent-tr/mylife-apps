'use strict';

const { createLogger, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { utils } = require('mylife-tools-common');
const business = require('.');

const logger = createLogger('mylife:gallery:business:slideshow');

exports.slideshowList = () => {
  const slideshows = getStoreCollection('slideshows');
  return slideshows.list();
};

exports.slideshowGet = (id) => {
  const slideshows = getStoreCollection('slideshows');
  return slideshows.get(id);
};

exports.slideshowCreate = slideshowCreate;
function slideshowCreate(values) {
  const entity = getMetadataEntity('slideshow');
  const slideshows = getStoreCollection('slideshows');
  const newSlideshow = entity.newObject(values);

  const item = slideshows.set(newSlideshow);
  logger.info(`Created slideshow '${item._id}'`);
  return item;
}

exports.slideshowDelete = async (slideshow) => {
  logger.info(`Deleting slideshow '${slideshow._id}'`);

  const collection = getStoreCollection('slideshows');
  if(!collection.delete(slideshow._id)) {
    throw new Error(`Cannot delete slideshow '${slideshow._id}' : album not found in collection`);
  }

  for(const thumbnailId of slideshow.thumbnails) {
    await business.thumbnailRemoveIfUnused(thumbnailId);
  }
};

exports.slideshowAddAlbum = (slideshow, albumId) => {
  const entity = getMetadataEntity('slideshow');
  const slideshows = getStoreCollection('slideshows');

  // ensure albumId is valid
  business.albumGet(albumId);

  const index = findAlbumIndex(slideshow, albumId);
  if(index !== -1) {
    throw new Error('L\'album existe déjà');
  }

  const newAlbums = utils.immutable.arrayPush(slideshow.albums, albumId);
  const newSlideshow = entity.getField('albums').setValue(slideshow, newAlbums);

  logger.info(`Adding album '${albumId}' on slideshow '${slideshow._id}'`);
  slideshows.set(newSlideshow);
};

exports.slideshowRemoveAlbum = (slideshow, albumId) => {
  const entity = getMetadataEntity('slideshow');
  const slideshows = getStoreCollection('slideshows');
  const index = findAlbumIndex(slideshow, albumId);
  if(index === -1) {
    throw new Error('L\'album n\'existe pas');
  }

  const newAlbums = utils.immutable.arrayRemove(slideshow.albums, index);
  const newSlideshow = entity.getField('albums').setValue(slideshow, newAlbums);

  logger.info(`Removing album '${albumId}' on slideshow '${slideshow._id}'`);
  slideshows.set(newSlideshow);
};

exports.slideshowMoveAlbum = (slideshow, oldIndex, newIndex) => {
  throw new Error('TODO');
};

function findAlbumIndex(slideshow, albumId) {
  return slideshow.albums.indexOf(albumId);
}
