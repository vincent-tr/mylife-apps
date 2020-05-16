'use strict';

const { StoreView, StoreContainer, createLogger, registerService, getService, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');

const logger = createLogger('mylife:monitor:nagios-service');

class NagiosService {
  constructor() {
  }

  async init(options) {
  }

  async terminate() {
  }

  getCollection() {
    return this.status;
  }

}

NagiosService.serviceName = 'nagios-service';

registerService(NagiosService);
