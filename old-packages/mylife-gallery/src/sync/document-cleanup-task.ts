import { createLogger } from 'mylife-tools-server';
import * as business from '../business';
import { Task } from './manager-task';

const logger = createLogger('mylife:gallery:sync:document-cleanup-task');

export class DocumentCleanupTask implements Task {
  async runStep() {

    logger.debug('Cleaning documents');

    const documentsToDelete = listDocumentsToDelete();
    await removeDocuments(documentsToDelete);

    logger.debug(`Done cleanup documents: ${documentsToDelete.length} documents deleted`);

    return false;
  }

  createNextTask(): Task {
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
