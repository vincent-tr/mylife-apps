export default [
  { id: 'nagios-host-status', enum: ['pending', 'up', 'down', 'unreachable'] },
  { id: 'nagios-service-status', enum: ['pending', 'ok', 'warning', 'unknown', 'critical'] },
  { id: 'nagios-object-type', enum: ['host', 'service'] },
];
