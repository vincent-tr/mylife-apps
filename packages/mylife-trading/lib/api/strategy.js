'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'strategy'
};

exports.notify = [ base, (session) => {
  return business.strategiesNotify(session);
} ];

exports.notifyStatus = [ base, (session) => {
  return business.statusNotify(session);
} ];

exports.create = [ base, (session, message) => {
  const { values } = message;
  const strategy = business.strategyCreate(values);
  return strategy._id;
} ];

exports.delete = [ base, (session, message) => {
  const { id } = message;
  const strategy = business.strategyGet(id);
  return business.strategyDelete(strategy);
} ];

exports.update = [ base, (session, message) => {
  const { id, values } = message;
  const strategy = business.strategyGet(id);
  return business.strategyUpdate(strategy, values);
} ];
