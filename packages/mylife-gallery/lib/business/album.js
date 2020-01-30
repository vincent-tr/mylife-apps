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

exports.albumFind = (id) => {
  const albums = getStoreCollection('albums');
  return albums.find(id);
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
    .filter(ref => ref.type === 'image')
    .slice(0, 5)
    .map(ref => business.documentGet(ref.type, ref.id))
    .map(doc => doc.thumbnail);

  // check that each doc ref is valid, and order them
  documents = sortDocumentReferences(documents);

  const values = { title, documents, thumbnails };
  return albumCreate(values);
};

exports.albumAddDocuments = (album, references) => {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');

  for(const reference of references) {
    const index = findDocRefIndex(album, reference);
    if(index !== -1) {
      throw new Error(`Le document '${reference.type}:${reference.id}' existe déjà`);
    }
  }

  const newDocuments = sortDocumentReferences([...album.documents, ...references]);
  const newAlbum = entity.getField('documents').setValue(album, newDocuments);

  logger.info(`Adding documents '${JSON.stringify(references)}' on album '${album._id}'`);
  albums.set(newAlbum);
};

exports.albumRemoveDocuments = (album, references) => {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');

  const indexes = references.map(reference => {
    const index = findDocRefIndex(album, reference);
    if(index === -1) {
      throw new Error(`Le document '${reference.type}:${reference.id}' n'existe pas`);
    }
    return index;
  });

  const newDocuments = utils.immutable.arrayRemoveMulti(album.documents, indexes);
  const newAlbum = entity.getField('documents').setValue(album, newDocuments);

  logger.info(`Removing documents '${JSON.stringify(references)}' on album '${album._id}'`);
  albums.set(newAlbum);
};

exports.albumMoveDocument = (album, oldIndex, newIndex) => {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');

  const newDocuments = utils.immutable.arrayMove(album.documents, oldIndex, newIndex);
  const newAlbum = entity.getField('documents').setValue(album, newDocuments);

  logger.info(`Moving document at '${oldIndex}' to '${newIndex}' on album '${album._id}'`);
  albums.set(newAlbum);
};

exports.albumListWithDocumentReference = (reference) => {
  const albums = getStoreCollection('albums');
  return albums.filter(album => findDocRefIndex(album, reference) > -1);
};

exports.albumSortDocuments = (album) => {
  const entity = getMetadataEntity('album');
  const albums = getStoreCollection('albums');

  const newDocuments = sortDocumentReferences(album.documents);
  const newAlbum = entity.getField('documents').setValue(album, newDocuments);

  logger.info(`Sorting documents on album '${album._id}'`);
  albums.set(newAlbum);
};

function docRefEquals(docref1, docref2) {
  return docref1.type === docref2.type && docref1.id === docref2.id;
}

function findDocRefIndex(album, reference) {
  return album.documents.findIndex(docref => docRefEquals(docref, reference));
}

function sortDocumentReferences(references) {
  // validate all reference, and sort by date (with undated image/video at the end, and others after)
  const refsWithDate = references.map(ref => {
    const document = business.documentGet(ref.type, ref.id);
    const type = ref.type;
    let date = null;
    switch(type) {
      case 'image':
      case 'video':
        date = document.date;
        break;
    }

    return { ...ref, date };
  });

  refsWithDate.sort((ref1, ref2) => {
    if(ref1.date !== null && ref2.date !== null) {
      return ref1.date.valueOf() - ref2.date.valueOf();
    }

    if(ref1.date !== null || ref2.date !== null) {
      return ref1.date === null ? 1 : -1;
    }

    // both null, move others at the end
    if(ref1.type === 'other' && ref2.type !== 'other') {
      return -1;
    }
    if(ref1.type !== 'other' && ref2.type === 'other') {
      return 1;
    }

    // else sort by id (default)
    return ref1.id < ref2.id ? -1 : 1;
  });

  return refsWithDate.map(({ type, id}) => ({type, id }));
}

function removeIndexes(array, indexes) {

}
