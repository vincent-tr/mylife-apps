'use strict';

const { getService, notifyView } = require('mylife-tools-server');

export function notifyNagios(session) {
  const service = getService('nagios-service');
  const collection = service.getDataCollection();
  const view = collection.createView();
  return notifyView(session, view);
}

export function notifyNagiosSummary(session) {
  const service = getService('nagios-service');
  const collection = service.getSummaryCollection();
  const view = collection.createView();
  return notifyView(session, view);
};
