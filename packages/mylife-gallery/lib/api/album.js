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
  return business.albumCreateFromDocuments(title, documents);
} ];

exports.deleteAlbum = [ base, (session, message) => {
  const { id } = message;
  const album = business.albumGet(id);
  return business.albumDelete(album);
} ];

exports.addDocumentToAlbum = [ base, (session, message) => {
  const { id, reference } = message;
  const album = business.albumGet(id);
  return business.albumAddDocument(album, reference);
} ];

exports.removeDocumentFromAlbum = [ base, (session, message) => {
  const { id, reference } = message;
  const album = business.albumGet(id);
  return business.albumRemoveDocument(album, reference);
} ];

exports.moveDocumentInAlbum = [ base, (session, message) => {
  const { id, oldIndex, newIndex } = message;
  const album = business.albumGet(id);
  return business.albumMoveDocument(album, oldIndex, newIndex);
} ];
