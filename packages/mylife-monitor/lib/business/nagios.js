'use strict';

const { getService, notifyView } = require('mylife-tools-server');

exports.notifyNagios = session => {
  const service = getService('nagios-service');
  const collection = service.getCollection();
  const view = collection.createView();
  return notifyView(session, view);
};
