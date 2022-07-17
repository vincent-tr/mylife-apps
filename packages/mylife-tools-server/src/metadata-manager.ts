import { registerService, getService } from './service-manager';
import { createLogger } from './logging';
import { metadata } from 'mylife-tools-common';

const logger = createLogger('mylife:tools:server:metadata-manager');

class MetadataManager {
  async init({ metadataDefintions }) {
    const { datatypes = [], entities = [] } = metadataDefintions || {};
    for(const datatype of datatypes) {
      metadata.registerDatatype(datatype);
      logger.debug(`datatype created: ${datatype.id}`);
    }
    for(const entity of entities) {
      metadata.registerEntity(entity);
      logger.debug(`entity created: ${entity.id}`);
    }
  }

  async terminate() {
  }

  getEntity(id: string) {
    return metadata.getEntity(id);
  }

  getDatatype(id: string) {
    return metadata.getDatatype(id);
  }

  static readonly serviceName = 'metadata-manager';
}

registerService(MetadataManager);

export function getMetadataEntity(id: string) {
  return getService('metadata-manager').getEntity(id);
}

export function getMetadataDatatype(id: string) {
  return getService('metadata-manager').getDatatype(id);
}

