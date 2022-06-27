'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'broker'
};

exports.notify = [ base, (session) => {
  return business.brokersNotify(session);
} ];

exports.create = [ base, (session, message) => {
  const { values } = message;
  return business.brokerCreate(values);
} ];

exports.delete = [ base, (session, message) => {
  const { id } = message;
  const broker = business.brokerGet(id);
  return business.brokerDelete(broker);
} ];

exports.update = [ base, (session, message) => {
  const { id, values } = message;
  const broker = business.brokerGet(id);
  return business.brokerUpdate(broker, values);
} ];
