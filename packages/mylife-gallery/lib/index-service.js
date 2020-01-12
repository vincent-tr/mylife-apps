'use strict';

const { registerService } = require('mylife-tools-server');
const business = require('./business');

class IndexService {
  async init() {
    business.documentIndexesInit();
  }

  async terminate() {
    business.documentIndexesTerminate();
  }
}

IndexService.serviceName = 'index-service';
IndexService.dependencies = ['store'];

registerService(IndexService);
