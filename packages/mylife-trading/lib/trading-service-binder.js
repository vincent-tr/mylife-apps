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
    const values = { _id: key, strategy: key, timestamp: new Date(), status };
    const object = this.entity.newObject(values);
    this._set(object);
  }

  setError(key, error) {
    const values = { _id: key, strategy: key, timestamp: new Date(), status: error.message, error: error.stack };
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
    this.errors = getStoreCollection('errors');
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
    this.errors = null;
    this.status = null;
    this.tradingService = null;
  }

  getStatusCollection() {
    return this.status;
  }

  _strategyChanged(event) {
    const { type, before, after } = event;
    switch (type) {
      case 'create': {
        this.queue.add('strategy-add', async () => this._strategyAdd(after));
        break;
      }

      case 'update': {
        if(isSame(before, after, STRATEGY_CHANGE_PROPS)) {
          return;
        }

        this.queue.add('strategy-update', async () => {
          await this._strategyRemove(before);
          await this._strategyAdd(after);
        });
        break;
      }

      case 'remove': {
        this.queue.add('strategy-remove', async () => this._strategyRemove(before));
        break;
      }
    }
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

    const configuration = mapConfiguration(strategy, broker);
    
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
      brokerType: broker.type,
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

  _newError(strategy, error) {
    const broker = this.brokers.get(strategy.broker);

    const values = {
      strategy: strategy._id,
      strategyImplementation: strategy.implementation,
      version,
      brokerType: broker.type,
      date: new Date(),
      message: error.message,
      stack: error.stack
    };

    const entity = getMetadataEntity('error');
    const newError = entity.newObject(values);
    this.errors.set(newError);
  }

  _onFatalError(strategy, error) {
    this._newError(strategy, error);

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

function mapConfiguration(strategy, broker) {
  const testSettings = broker.testSettings && { ...broker.testSettings };
  const credentials = broker.credentials && { ...broker.credentials, password: business.passwordDecrypt(broker.credentials.password) };
  const brokerConfiguration = { type: broker.type, credentials, testSettings };
  return { instrumentId: strategy.instrumentId, implementation: strategy.implementation, risk: strategy.risk, name: strategy.display, broker: brokerConfiguration };
}

const STRATEGY_CHANGE_PROPS = ['implementation', 'enabled', 'broker', 'instrumentId', 'risk'];

function isSame(obj1, obj2, props) {
  for(const prop of props) {
    const val1 = obj1[prop];
    const val2 = obj2[prop];

    if(!Object.is(val1, val2)) {
      return false;
    }
  }

  return true;
}
