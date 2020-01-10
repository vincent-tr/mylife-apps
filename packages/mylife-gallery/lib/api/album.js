'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'album'
};

exports.notifyAlbums = [ base, (session/*, message*/) => {
  return business.albumsNotify(session);
} ];

exports.createAlbum = [ base, (session, message) => {
  const { values } = message;
  return business.albumCreate(values);
} ];

exports.addDocumentToAlbum = [ base, (session, message) => {
  const { id, reference } = message;
  return business.albumAddDocument(id, reference);
} ];

exports.removeDocumentFromAlbum = [ base, (session, message) => {
  const { id, reference } = message;
  return business.albumRemoveDocument(id, reference);
} ];
