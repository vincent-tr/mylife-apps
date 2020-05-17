'use strict';

module.exports = [
  { id: 'host-status', enum: ['pending', 'up', 'down', 'unreachable'] },
  { id: 'service-status', enum: ['pending', 'ok', 'warning', 'unknown', 'critical'] },
];
