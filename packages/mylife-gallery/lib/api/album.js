'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'album'
};

exports.notifyAlbum = [ base, (session, message) => {
  const { id } = message;
  return business.albumNotify(session, id);
} ];

exports.notifyAlbums = [ base, (session, message) => {
  const { criteria } = message;
  return business.albumsNotify(session, criteria);
} ];

exports.createAlbumFromDocuments = [ base, (session, message) => {
  const { title, documents } = message;
  const album = business.albumCreateFromDocuments(title, documents);
  return album._id;
} ];

exports.deleteAlbum = [ base, (session, message) => {
  const { id } = message;
  const album = business.albumGet(id);
  return business.albumDelete(album);
} ];

exports.updateAlbum = [ base, (session, message) => {
  const { id, values } = message;
  const album = business.albumGet(id);
  return business.albumUpdate(album, values);
} ];

exports.addDocumentsToAlbum = [ base, (session, message) => {
  const { id, references } = message;
  const album = business.albumGet(id);
  return business.albumAddDocuments(album, references);
} ];

exports.removeDocumentsFromAlbum = [ base, (session, message) => {
  const { id, references } = message;
  const album = business.albumGet(id);
  return business.albumRemoveDocuments(album, references);
} ];

exports.moveDocumentInAlbum = [ base, (session, message) => {
  const { id, oldIndex, newIndex } = message;
  const album = business.albumGet(id);
  return business.albumMoveDocument(album, oldIndex, newIndex);
} ];
