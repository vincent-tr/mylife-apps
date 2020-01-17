'use strict';

const { createLogger, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { utils } = require('mylife-tools-common');
const business = require('.');

const logger = createLogger('mylife:gallery:business:album');

exports.albumList = () => {
  const albums = getStoreCollection('albums');
  return albums.list();
};

exports.albumGet = (id) => {
  const albums = getStoreCollection('albums');
  return albums.get(id);
};

exports.albumIsThumbnailUsed = (thumbnailId) => {
  for(const album of getStoreCollection('albums')) {
    if(album.thumbnails.includes(thumbnailId)) {
      return true;
    }
  }

  return false;
};

exports.albumCreate = albumCreate;
function albumCreate(values) {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');
  const newAlbum = entity.newObject(values);

  const item = albums.set(newAlbum);
  logger.info(`Created album '${item._id}'`);
  return item;
}

exports.albumDelete = async (album) => {
  logger.info(`Deleting album '${album._id}'`);

  for(const slideshow of business.slideshowListWithAlbumId(album._id)) {
    business.slideshowRemoveAlbum(slideshow, album._id);
  }

  const collection = getStoreCollection('albums');
  if(!collection.delete(album._id)) {
    throw new Error(`Cannot delete album '${album._id}' : document not found in collection`);
  }

  for(const thumbnailId of album.thumbnails) {
    await business.thumbnailRemoveIfUnused(thumbnailId);
  }
};

exports.albumUpdate = (album, values) => {
  logger.info(`Setting values '${JSON.stringify(values)}' on album '${album._id}'`);

  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');
  const newAlbum = entity.setValues(album, values);

  albums.set(newAlbum);
};

exports.albumCreateFromDocuments = (title, documents) => {
  // take 5 first images thumbnails
  const thumbnails = documents
    .map(ref => business.documentGet(ref.type, ref.id))
    .filter(doc => doc._entity === 'image')
    .slice(0, 5)
    .map(doc => doc.thumbnail);

  const values = { title, documents, thumbnails };
  const album = albumCreate(values);
  return album._id;
};

exports.albumAddDocument = (album, reference) => {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');

  // ensure reference is valid
  business.documentGet(reference.type, reference.id);

  const index = findDocRefIndex(album, reference);
  if(index !== -1) {
    throw new Error('Le document existe déjà');
  }

  const newDocuments = utils.immutable.arrayPush(album.documents, reference);
  const newAlbum = entity.getField('documents').setValue(album, newDocuments);

  logger.info(`Adding document '${reference.type}:${reference.id}' on album '${album._id}'`);
  albums.set(newAlbum);
};

exports.albumRemoveDocument = (album, reference) => {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');
  const index = findDocRefIndex(album, reference);
  if(index === -1) {
    throw new Error('Le document n\'existe pas');
  }

  const newDocuments = utils.immutable.arrayRemove(album.documents, index);
  const newAlbum = entity.getField('documents').setValue(album, newDocuments);

  logger.info(`Removing document '${reference.type}:${reference.id}' on album '${album._id}'`);
  albums.set(newAlbum);
};

exports.albumMoveDocument = (album, oldIndex, newIndex) => {
  throw new Error('TODO');
};

exports.albumListWithDocumentReference = (reference) => {
  const albums = getStoreCollection('albums');
  return albums.filter(album => findDocRefIndex(album, reference) > -1);
};

function docRefEquals(docref1, docref2) {
  return docref1.type === docref2.type && docref1.id === docref2.id;
}

function findDocRefIndex(album, reference) {
  return album.documents.findIndex(docref => docRefEquals(docref, reference));
}
