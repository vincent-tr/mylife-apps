'use strict';

const { createLogger, getStoreCollection, getMetadataEntity, notifyView } = require('mylife-tools-server');
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

exports.albumCreate = albumCreate;
function albumCreate(values) {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');
  const newAlbum = entity.newObject(values);

  const item = albums.set(newAlbum);
  logger.info(`Created album '${item._id}'`);
  return item;
}

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

exports.albumAddDocument = (albumId, reference) => {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');
  const album = albums.get(albumId);

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

exports.albumRemoveDocument = (albumId, reference) => {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');
  const album = albums.get(albumId);
  const index = findDocRefIndex(album, reference);
  if(index === -1) {
    throw new Error('Le document n\'existe pas');
  }

  const newDocuments = utils.immutable.arrayRemove(album.documents, index);
  const newAlbum = entity.getField('documents').setValue(album, newDocuments);

  logger.info(`Removing document '${reference.type}:${reference.id}' on album '${album._id}'`);
  albums.set(newAlbum);
};

exports.albumsNotify = (session) => {
  const albums = getStoreCollection('albums');
  return notifyView(session, albums.createView());
};

function docRefEquals(docref1, docref2) {
  return docref1.type === docref2.type && docref1.id === docref2.id;
}

function findDocRefIndex(album, reference) {
  return album.documents.findIndex(docref => docRefEquals(docref, reference));
}
