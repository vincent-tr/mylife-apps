'use strict';

const { createLogger } = require('mylife-tools-server');
const business = require('../business');

const logger = createLogger('mylife:gallery:sync:document-cleanup-task');

exports.DocumentCleanupTask = class DocumentCleanupTask {
  async runStep() {

    logger.debug('Cleaning documents');

    const documentsToDelete = listDocumentsToDelete();
    await removeDocuments(documentsToDelete);

    logger.debug(`Done cleanup documents: ${documentsToDelete.length} documents deleted`);

    return false;
  }

  createNextTask() {
    return null;
  }
};

function listDocumentsToDelete() {
  return business.documentFilter(document => document.paths.length === 0);
}

async function removeDocuments(documentsToDelete) {
  for(const document of documentsToDelete) {
    try {
      await business.documentRemove(document);
    } catch(err) {
      logger.error(`Error deleting document '${document._entity}:${document._id}' : ${err.stack}`);
    }
  }
}
