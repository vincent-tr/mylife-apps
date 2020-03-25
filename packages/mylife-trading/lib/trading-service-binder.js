'use strict';

const { StoreContainer, createLogger, registerService, getService, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');

const logger = createLogger('mylife:trading:trading-service-binder');

class StatusCollection extends StoreContainer {
  constructor() {
    super();
    this.entity = getMetadataEntity('strategy-status');
  }

  set(key, status) {
    // use key for both strategy and strategy-status id
    const values = { _id: key, strategy: key, status };
    const object = this.entity.newObject(values);
    this._set(object);
  }

  delete(key) {
    this._delete(key);
  }
}

class TradingServiceBinder {
  constructor() {
    this.strategyChangedCb = (event) => this._strategyChanged(event);
  }

  async init(options) {
    this.brokers = getStoreCollection('brokers');
    this.strategies = getStoreCollection('strategies');
    this.stats = getStoreCollection('stats');
    this.status = new StatusCollection();
    this.tradingService = getService('trading-service');
    this.queue = getService('task-queue-manager').createQueue('trading-service-queue');

    this.strategies.on('change', this.strategyChangedCb);

    for (const strategy of this.strategies.list()) {
      this._strategyChanged({ type: 'create', after: strategy });
    }

    /*
    const configuration = { epic: 'CS.D.EURUSD.MINI.IP', implementation: 'forex-scalping-m1-extreme', risk: 5, name: 'test' };
    const credentials = { key: process.env.IGKEY, identifier: process.env.IGID, password: process.env.IGPASS, isDemo: true };
    const listeners = {
      onStatusChanged: (status) => console.log('STATUSLISTENER', status),
      onNewPositionSummary: (summary) => console.log('SUMMARYLISTENER', JSON.stringify(summary))
    };

    await this.tradingService.add('test', configuration, credentials, listeners);
    */
  }

  async terminate() {
    this.strategies.off('change', this.strategyChangedCb);

    for (const strategy of this.strategies.list()) {
      this._strategyChanged({ type: 'remove', before: strategy });
    }

    await getService('task-queue-manager').closeQueue('trading-service-queue');

    this.queue = null;
    this.broker = null;
    this.strategies = null;
    this.stats = null;
    this.status = null;
    this.tradingService = null;
  }

  getStatusCollection() {
    return this.status;
  }

  _strategyChanged(event) {
    this.queue.add('strategy-update', async () => {
      const { type, before, after } = event;
      switch (type) {
        case 'create': {
          await this._strategyAdd(after);
          break;
        }

        case 'update': {
          await this._strategyRemove(before);
          await this._strategyAdd(after);
          break;
        }

        case 'remove': {
          await this._strategyRemove(before);
          break;
        }
      }
    });
  }

  async _strategyRemove(strategy) {
    if (!strategy.enabled) {
      return;
    }

    logger.info(`deleting strategy '${strategy._id}'`);

    const key = strategy._id;
    await this.tradingService.remove(key);
    this.status.delete(key);
  }

  async _strategyAdd(strategy) {
    if (!strategy.enabled) {
      return;
    }

    logger.info(`creating strategy '${strategy._id}'`);

    const key = strategy._id;
    const broker = this.brokers.get(strategy.broker);

    // format tradingService parameters
    const configuration = { epic: strategy.epic, implementation: strategy.implementation, risk: strategy.risk, name: strategy.display };
    const credentials = { key: broker.key, identifier: broker.identifier, password: broker.password, isDemo: broker.demo };
    const listeners = {
      onStatusChanged: (status) => this.status.set(key, status),
      onNewPositionSummary: (summary) => this._newPositionSummary(strategy, summary)
    };

    await this.tradingService.add(key, configuration, credentials, listeners);
  }

  _newPositionSummary(strategy, summary) {
    const broker = this.brokers.get(strategy.broker);

    const values = {
      strategy: strategy._id,
      strategyImplementation: strategy.implementation,
      demo: broker.demo,
      epic: strategy.epic,
      dealId: summary.dealId,
      openDate: summary.openDate,
      closeDate: summary.closeDate,
      openLevel: summary.openLevel,
      closeLevel: summary.closeLevel,
      size: summary.size,
      profitAndLoss: summary.profitAndLoss,
      currency: summary.currency,
    };

    const entity = getMetadataEntity('stat');
    const newStat = entity.newObject(values);
    this.stats.set(newStat);
  }
}

TradingServiceBinder.serviceName = 'trading-service-binder';
TradingServiceBinder.dependencies = ['trading-service', 'store', 'task-queue-manager'];

registerService(TradingServiceBinder);
