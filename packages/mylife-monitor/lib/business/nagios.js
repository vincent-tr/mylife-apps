'use strict';

const { getStoreCollection, notifyView } = require('mylife-tools-server');

exports.notifyNagios = session => {
  const accounts = getStoreCollection('accounts');
  return notifyView(session, accounts.createView());
};
