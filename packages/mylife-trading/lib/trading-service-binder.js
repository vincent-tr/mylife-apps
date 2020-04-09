'use strict';

const { StoreView, StoreContainer, createLogger, registerService, getService, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const business = require('./business');
const { version } = require('../package.json');

const logger = createLogger('mylife:trading:trading-service-binder');

class StatusView extends StoreContainer {
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

  setError(key, error) {
    const values = { _id: key, strategy: key, status: error.message, error: error.stack };
    const object = this.entity.newObject(values);
    this._set(object);
  }

  delete(key) {
    this._delete(key);
  }

  createView(filterCallback = () => true) {
    const view = new StoreView(this);
    view.setFilter(filterCallback);
    return view;
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
    this.status = new StatusView();
    this.tradingService = getService('trading-service');
    this.queue = getService('task-queue-manager').createQueue('trading-service-queue');

    this.strategies.on('change', this.strategyChangedCb);

    for (const strategy of this.strategies.list()) {
      this._strategyChanged({ type: 'create', after: strategy });
    }
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

    const status = this.status.get(key);
    if (!status.error) {
      await this.tradingService.remove(key);
    }

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
    const brokerConfiguration = { type: broker.type, credentials: broker.credentials, testSettings: broker.testSettings };
    if(brokerConfiguration.credentials) {
      brokerConfiguration.credentials.password = business.passwordDecrypt(brokerConfiguration.credentials.password);
    }
    const configuration = { instrumentId: strategy.instrumentId, implementation: strategy.implementation, risk: strategy.risk, name: strategy.display, broker: brokerConfiguration };

    const listeners = {
      onStatusChanged: (status) => this.status.set(key, status),
      onNewPositionSummary: (summary) => this._newPositionSummary(strategy, summary),
      onFatalError: (error) => this._onFatalError(strategy, error)
    };

    await this.tradingService.add(key, configuration, listeners);
  }

  _newPositionSummary(strategy, summary) {
    const broker = this.brokers.get(strategy.broker);

    const values = {
      strategy: strategy._id,
      strategyImplementation: strategy.implementation,
      version,
      demo: broker.demo,
      instrumentId: strategy.instrumentId,
      dealId: summary.dealId,
      openDate: summary.openDate,
      closeDate: summary.closeDate,
      openLevel: summary.openLevel,
      closeLevel: summary.closeLevel,
      size: summary.size,
      profitAndLoss: summary.profitAndLoss,
      currency: summary.currency,
      orders: summary.orders
    };

    const entity = getMetadataEntity('stat');
    const newStat = entity.newObject(values);
    this.stats.set(newStat);
  }

  _onFatalError(strategy, error) {
    this.queue.add('strategy-update', async () => {
      const key = strategy._id;
      await this.tradingService.remove(key);
      this.status.setError(key, error);
    });
  }
}

TradingServiceBinder.serviceName = 'trading-service-binder';
TradingServiceBinder.dependencies = ['trading-service', 'store', 'task-queue-manager'];

registerService(TradingServiceBinder);
