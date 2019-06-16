'use strict';

const { createLogger, createDecoratorGroup } = require('mylife-tools-server');
const logger = createLogger('mylife:money:api:decorators');

const methodLogger = method => {
  const { callee, service, name } = method;
  method.callee = async (session, ...args) => {
    logger.debug(`Calling ${service}.${name}`);
    const result = await callee(session, ...args);
    logger.debug(`Called ${service}.${name} : ${result}`);
  };
};

exports.base = createDecoratorGroup(methodLogger);
