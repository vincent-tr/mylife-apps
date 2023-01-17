'use strict';

exports.datatypes = require('./datatypes');
exports.entities = [
  require('./entities/account'),
  require('./entities/group'),
  require('./entities/operation'),
  require('./entities/bot'),
  require('./entities/bot-run'),
  require('./entities/report-operation-stat'),
  require('./entities/report-total-by-month'),
  require('./entities/report-group-by-month'),
  require('./entities/report-group-by-year'),
];
