'use strict';

const { createLogger } = require('mylife-tools-server');
const business = require('../business');
const { base } = require('./decorators');

const logger = createLogger('mylife:money:api:management');

export const meta = {
  name : 'management'
};

export const createGroup = [ base, (session, message) => {
  const { object } = message;
  const res = business.createGroup(object);
  logger.info(`group created: ${JSON.stringify(res)}`);
  return res._id;
} ];

export const updateGroup = [ base, (session, message) => {
  const { object } = message;
  const res = business.updateGroup(object);
  logger.info(`group updated: ${JSON.stringify(res)}`);
} ];

export const deleteGroup = [ base, (session, message) => {
  const { id } = message;
  business.deleteGroup(id);
  logger.info(`group deleted: ${id}`);
} ];

export const notifyOperations = [ base, (session, message) => {
  const { minDate, maxDate, account, group, lookupText } = message;
  const criteria = { minDate, maxDate, account, group, lookupText };
  return business.notifyOperations(session, criteria);
} ];

export const moveOperations = [ base, (session, message) => {
  const { group, operations } = message;
  const status = business.operationsMove(group, operations);
  logger.info(`Operations moved: ${JSON.stringify({ group, operations })} -> ${JSON.stringify(status)}`);
  return status;
} ];

export const operationsSetNote = [ base, (session, message) => {
  const { note, operations } = message;
  const status = business.operationsSetNote(note, operations);
  logger.info(`Operations note set: ${JSON.stringify({ note, operations })} -> ${JSON.stringify(status)}`);
} ];

export const operationsImport = [ base, (session, message) => {
  const { account, content } = message;
  const count = business.operationsImport(account, content);
  business.executeRules();
  return count;
} ];

export const operationsExecuteRules = [ base, (/*session, message*/) => {
  return business.executeRules();
} ];
