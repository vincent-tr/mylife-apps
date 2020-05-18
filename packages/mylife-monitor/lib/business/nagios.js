'use strict';

const { getService, notifyView } = require('mylife-tools-server');

exports.notifyNagios = session => {
  const service = getService('nagios-service');
  const collection = service.getDataCollection();
  const view = collection.createView();
  return notifyView(session, view);
};

exports.notifyNagiosSummary = session => {
  const service = getService('nagios-service');
  const collection = service.getSummaryCollection();
  const view = collection.createView();
  return notifyView(session, view);
};
