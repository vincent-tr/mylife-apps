'use strict';

const { createLogger } = require('mylife-tools-server');
const business = require('../business');
const { base } = require('../registry').decorators;

const logger = createLogger('mylife:money:api:management');

exports.meta = {
  name : 'management'
};

exports.getAccounts = [ base, async (session, message) => {
  return await business.getAccounts();
} ];

exports.getGroups = [ base, async (session, message) => {
  return await business.getGroups();
} ];

exports.createGroup = [ base, async (session, message) => {
  const { object } = message;
  const res = await business.createGroup(object);
  logger.info(`group created: ${JSON.stringify(res)}`);
  return res;
} ];

exports.updateGroup = [ base, async (session, message) => {
  const { object } = message;
  const res = await business.updateGroup(object);
  logger.info(`group updated: ${JSON.stringify(res)}`);
  return res;
} ];

exports.deleteGroup = [ base, async (session, message) => {
  const { id } = message;
  const res = await business.deleteGroup(id);
  logger.info(`group deleted: ${id}`);
  return res;
} ];

exports.getOperations = [ base, async (session, message) => {
  const { minDate, maxDate, account } = message;
  return await business.getOperations(minDate, maxDate, account);
} ];

exports.moveOperations = [ base, async (session, message) => {
  const { group, operations } = message;
  const status = await business.operationsMove(group, operations);
  logger.info(`Operations moved: ${JSON.stringify({ group, operations })} -> ${JSON.stringify(status)}`);
  return status;
} ];

exports.operationsSetNote = [ base, async (session, message) => {
  const { note, operations } = message;
  const status = await business.operationsSetNote(note, operations);
  logger.info(`Operations note set: ${JSON.stringify({ note, operations })} -> ${JSON.stringify(status)}`);
} ];

exports.operationsImport = [ base, async (session, message) => {
  const { account, content } = message;
  const count = await business.operationsImport(account, content);
  await business.executeRules();
  return count;
} ];

exports.operationsExecuteRules = [ base, async (session, message) => {
  return await business.executeRules();
} ];
