'use strict';

exports.datatypes = require('./datatypes');
exports.entities = [
  require('./entities/nagios-host-group'),
  require('./entities/nagios-host'),
  require('./entities/nagios-service'),
];
