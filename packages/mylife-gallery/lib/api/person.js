'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'person'
};

exports.notifyPerson = [ base, (session, message) => {
  const { id } = message;
  return business.personNotify(session, id);
} ];

exports.notifyPersons = [ base, (session, message) => {
  const { criteria } = message;
  return business.personsNotify(session, criteria);
} ];

exports.createPersonFromDocuments = [ base, (session, message) => {
  const { firstName, lastName, documents } = message;
  const person = business.personCreateFromDocuments(firstName, lastName, documents);
  return person._id;
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
