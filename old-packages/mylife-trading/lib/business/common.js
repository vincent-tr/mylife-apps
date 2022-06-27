'use strict';

const { getNotifiedView } = require('mylife-tools-server');

exports.renotifyWithCriteria = (session, viewId, criteria) => {
  const view = getNotifiedView(session, viewId);
  view.setCriteria(criteria);
};
