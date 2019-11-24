'use strict';

const { createLogger } = require('mylife-tools-server');
const business = require('../business');

const logger = createLogger('mylife:gallery:sync:document-cleanup-task');

exports.DocumentUpdaterTask = class DocumentUpdaterTask {
  async runStep() {

    logger.debug('Cleaning documents');

    const documentsToDelete = listDocumentsToDelete();
    removeDocuments(documentsToDelete);

    logger.debug(`Done cleanup documents: ${documentsToDelete.length} documents deleted`);

    return false;
  }

  createNextTask() {
    return null;
  }
};

function listDocumentsToDelete() {
  return business.documentFilter(document => document.paths.length === 0).map(document => ({ type: document._entity, id: document._id }));
}

function removeDocuments(documentsToDelete) {
  for(const { type, id } of documentsToDelete) {
    try {
      business.documentRemove(type, id);
    } catch(err) {
      logger.error(err.stack);
    }
  }
}
