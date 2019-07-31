'use strict';

const { createLogger } = require('mylife-tools-server');
const business = require('../business');
const { base } = require('./decorators');

const logger = createLogger('mylife:money:api:management');

exports.meta = {
  name : 'management'
};

exports.getAccounts = [ base, (session, message) => {
  return business.getAccounts();
} ];

exports.getGroups = [ base, (session, message) => {
  return business.getGroups();
} ];

exports.createGroup = [ base, (session, message) => {
  const { object } = message;
  const res = business.createGroup(object);
  logger.info(`group created: ${JSON.stringify(res)}`);
  return res;
} ];

exports.updateGroup = [ base, (session, message) => {
  const { object } = message;
  const res = business.updateGroup(object);
  logger.info(`group updated: ${JSON.stringify(res)}`);
  return res;
} ];

exports.deleteGroup = [ base, (session, message) => {
  const { id } = message;
  business.deleteGroup(id);
  logger.info(`group deleted: ${id}`);
} ];

exports.getOperations = [ base, (session, message) => {
  const { minDate, maxDate, account } = message;
  return business.getOperations(minDate, maxDate, account);
} ];

exports.moveOperations = [ base, (session, message) => {
  const { group, operations } = message;
  const status = business.operationsMove(group, operations);
  logger.info(`Operations moved: ${JSON.stringify({ group, operations })} -> ${JSON.stringify(status)}`);
  return status;
} ];

exports.operationsSetNote = [ base, (session, message) => {
  const { note, operations } = message;
  const status = business.operationsSetNote(note, operations);
  logger.info(`Operations note set: ${JSON.stringify({ note, operations })} -> ${JSON.stringify(status)}`);
} ];

exports.operationsImport = [ base, (session, message) => {
  const { account, content } = message;
  const count = business.operationsImport(account, content);
  business.executeRules();
  return count;
} ];

exports.operationsExecuteRules = [ base, (session, message) => {
  return business.executeRules();
} ];
