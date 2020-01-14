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
