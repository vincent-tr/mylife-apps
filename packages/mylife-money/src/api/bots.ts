'use strict';

const { createLogger } = require('mylife-tools-server');
const business = require('../business');
const { base } = require('./decorators');

const logger = createLogger('mylife:money:api:bots');

export const meta = {
  name : 'bots'
};

export const createBot = [ base, (session, message) => {
  const { object } = message;
  const res = business.createBot(object);
  logger.info(`bot created: ${JSON.stringify(res)}`);
  return res._id;
} ];

export const updateBot = [ base, (session, message) => {
  const { object } = message;
  const res = business.updateBot(object);
  logger.info(`bot updated: ${JSON.stringify(res)}`);
} ];

export const deleteBot = [ base, (session, message) => {
  const { id } = message;
  business.deleteBot(id);
  logger.info(`bot deleted: ${id}`);
} ];


export const notifyBots = [ base, (session/*, message*/) => {
  return business.notifyBots(session);
} ];

export const notifyBotRuns = [ base, (session, message) => {
  const { botId } = message;
  return business.notifyBotRuns(session, botId);
} ];
