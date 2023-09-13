import * as business from '../business';
import { base } from './decorators';

export const meta = {
  name : 'album'
};

export const notifyAlbum = [ base, (session, message) => {
  const { id } = message;
  return business.albumNotify(session, id);
} ];

export const notifyAlbums = [ base, (session, message) => {
  const { criteria } = message;
  return business.albumsNotify(session, criteria);
} ];

export const createAlbumFromDocuments = [ base, (session, message) => {
  const { title, documents } = message;
  const album = business.albumCreateFromDocuments(title, documents);
  return album._id;
} ];

export const deleteAlbum = [ base, (session, message) => {
  const { id } = message;
  const album = business.albumGet(id);
  return business.albumDelete(album);
} ];

export const updateAlbum = [ base, (session, message) => {
  const { id, values } = message;
  const album = business.albumGet(id);
  return business.albumUpdate(album, values);
} ];

export const addDocumentsToAlbum = [ base, (session, message) => {
  const { id, references } = message;
  const album = business.albumGet(id);
  return business.albumAddDocuments(album, references);
} ];

export const removeDocumentsFromAlbum = [ base, (session, message) => {
  const { id, references } = message;
  const album = business.albumGet(id);
  return business.albumRemoveDocuments(album, references);
} ];

export const moveDocumentInAlbum = [ base, (session, message) => {
  const { id, oldIndex, newIndex } = message;
  const album = business.albumGet(id);
  return business.albumMoveDocument(album, oldIndex, newIndex);
} ];
