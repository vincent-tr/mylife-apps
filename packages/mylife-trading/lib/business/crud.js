'use strict';

const { createLogger, notifyView, getStoreCollection, getMetadataEntity, getService } = require('mylife-tools-server');
const business = require('.');

const logger = createLogger('mylife:trading:business:crud');

exports.brokerGet = (id) => {
  const brokers = getStoreCollection('brokers');
  return brokers.get(id);
};

exports.brokerCreate = ({ password, ...values }) => {
  const entity = getMetadataEntity('broker');
  const brokers = getStoreCollection('brokers');
  const newBroker = entity.newObject({ password: business.passwordEncrypt(password), ...values });

  const item = brokers.set(newBroker);
  logger.info(`Created broker '${item._id}'`);
  return item;
};

exports.brokerDelete = broker => {
  const strategies = getStoreCollection('strategies');
  const usage = strategies.filter(strategy => strategy.broker === broker._id);
  if (usage.length) {
    const strategyEntity = getMetadataEntity('strategy');
    const list = usage.map(strategy => `'${strategyEntity.render(strategy)}'`).join(', ');
    throw new Error(`Impossible de supprimer le compte car il est utilisé dans les stratégies suivantes : ${list}`);
  }

  logger.info(`Deleting broker '${broker._id}'`);

  const collection = getStoreCollection('brokers');
  if (!collection.delete(broker._id)) {
    throw new Error(`Cannot delete broker '${broker._id}' : document not found in collection`);
  }
};

exports.brokerUpdate = (broker, values) => {
  const { password } = values;
  if (password) {
    values = { ...values, password: business.passwordEncrypt(password) };
  }
  logger.info(`Setting values '${JSON.stringify(values)}' on broker '${broker._id}'`);

  const entity = getMetadataEntity('broker');
  const brokers = getStoreCollection('brokers');
  const item = entity.setValues(broker, values);

  brokers.set(item);
  return item;
};

exports.brokersNotify = (session) => {
  const brokers = getStoreCollection('brokers');
  const view = brokers.createView();
  return notifyView(session, view);
};

exports.strategyGet = (id) => {
  const strategies = getStoreCollection('strategies');
  return strategies.get(id);
};

exports.strategyCreate = (values) => {
  const entity = getMetadataEntity('strategy');
  const strategies = getStoreCollection('strategies');
  const newStrategy = entity.newObject(values);

  const item = strategies.set(newStrategy);
  logger.info(`Created strategy '${item._id}'`);
  return item;
};

exports.strategyDelete = strategy => {
  logger.info(`Deleting strategy '${strategy._id}'`);

  const collection = getStoreCollection('strategies');
  if (!collection.delete(strategy._id)) {
    throw new Error(`Cannot delete strategy '${strategy._id}' : document not found in collection`);
  }
};

exports.strategyUpdate = (strategy, values) => {
  logger.info(`Setting values '${JSON.stringify(values)}' on strategy '${strategy._id}'`);

  const entity = getMetadataEntity('strategy');
  const strategies = getStoreCollection('strategies');
  const item = entity.setValues(strategy, values);

  strategies.set(item);
  return item;
};

exports.strategiesNotify = (session) => {
  const strategies = getStoreCollection('strategies');
  const view = strategies.createView();
  return notifyView(session, view);
};

exports.statusNotify = (session) => {
  const status = getStoreCollection('strategies');
  const view = status.createView();
  return notifyView(session, view);
};

exports.statsNotify = (session) => {
  const tradingServiceBinder = getService('trading-service-binder');
  const stats = tradingServiceBinder.getStatusCollection('stats');
  const view = stats.createView();
  return notifyView(session, view);
};
