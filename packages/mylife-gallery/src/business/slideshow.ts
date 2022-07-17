import { createLogger, getStoreCollection, getMetadataEntity, notifyView } from 'mylife-tools-server';
import { utils } from 'mylife-tools-common';
import * as business from '.';

const logger = createLogger('mylife:gallery:business:slideshow');

export function slideshowList() {
  const slideshows = getStoreCollection('slideshows');
  return slideshows.list();
}

export function slideshowGet(id) {
  const slideshows = getStoreCollection('slideshows');
  return slideshows.get(id);
}

export function slideshowFind(id) {
  const slideshows = getStoreCollection('slideshows');
  return slideshows.find(id);
}

export function slideshowNotify(session, id) {
  const slideshows = getStoreCollection('slideshows');
  return notifyView(session, slideshows.createView(slideshow => slideshow._id === id));
}

export function slideshowsNotify(session) {
  const slideshows = getStoreCollection('slideshows');
  return notifyView(session, slideshows.createView());
}

export function slideshowCreate(values) {
  const entity = getMetadataEntity('slideshow');
  const slideshows = getStoreCollection('slideshows');
  const newSlideshow = entity.newObject(values);

  const item = slideshows.set(newSlideshow);
  logger.info(`Created slideshow '${item._id}'`);
  return item;
}

export async function slideshowDelete(slideshow) {
  logger.info(`Deleting slideshow '${slideshow._id}'`);

  const collection = getStoreCollection('slideshows');
  if(!collection.delete(slideshow._id)) {
    throw new Error(`Cannot delete slideshow '${slideshow._id}' : album not found in collection`);
  }
}

export function slideshowUpdate(slideshow, values) {
  logger.info(`Setting values '${JSON.stringify(values)}' on slideshow '${slideshow._id}'`);

  const entity = getMetadataEntity('slideshow');
  const slideshows = getStoreCollection('slideshows');
  const newSlideshow = entity.setValues(slideshow, values);

  slideshows.set(newSlideshow);
}

export function slideshowAddAlbum(slideshow, albumId) {
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
}

export function slideshowRemoveAlbum(slideshow, albumId) {
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
}

export function slideshowMoveAlbum(slideshow, oldIndex, newIndex) {
  const entity = getMetadataEntity('slideshow');
  const slideshows = getStoreCollection('slideshows');

  const newAlbums = utils.immutable.arrayMove(slideshow.albums, oldIndex, newIndex);
  const newSlideshow = entity.getField('albums').setValue(slideshow, newAlbums);

  logger.info(`Moving album at '${oldIndex}' to '${newIndex}' on slideshow '${slideshow._id}'`);
  slideshows.set(newSlideshow);
}

export function slideshowListWithAlbumId(albumId) {
  const slideshows = getStoreCollection('slideshows');
  return slideshows.filter(slideshow => findAlbumIndex(slideshow, albumId) > -1);
}

function findAlbumIndex(slideshow, albumId) {
  return slideshow.albums.indexOf(albumId);
}
