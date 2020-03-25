'use strict';

const { createLogger, registerService, getService, getStoreCollection } = require('mylife-tools-server');

const logger = createLogger('mylife:trading:trading-service-binder');

class TradingServiceBinder {
  async init(options) {

    // TODO

    const configuration = { epic: 'CS.D.EURUSD.MINI.IP', implementation: 'forex-scalping-m1-extreme', risk: 5, name: 'test' };
    const credentials = { key: process.env.IGKEY, identifier: process.env.IGID, password: process.env.IGPASS, isDemo: true };
    const listeners = {
      onStatusChanged: (status) => console.log('STATUSLISTENER', status),
      onNewPositionSummary: (summary) => console.log('SUMMARYLISTENER', JSON.stringify(summary))
    };

    const tradingService = getTradingService();
    await tradingService.add('test', configuration, credentials, listeners);
  }

  async terminate() {
    // TODO
  }
}

TradingServiceBinder.serviceName = 'trading-service-binder';
TradingServiceBinder.dependencies = ['trading-service', 'store'];

registerService(TradingServiceBinder);

function getTradingService() {
  return getService('trading-service');
}