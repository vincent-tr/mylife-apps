export default [
  { id: 'percent', primitive: 'number' },
  { id: 'voltage', primitive: 'number' },
  { id: 'power', primitive: 'number' },
  { id: 'duration', primitive: 'number' },
  { id: 'nagios-host-status', enum: ['pending', 'up', 'down', 'unreachable'] },
  { id: 'nagios-service-status', enum: ['pending', 'ok', 'warning', 'unknown', 'critical'] },
  { id: 'nagios-object-type', enum: ['host', 'service'] },
  { id: 'upsmon-status-flag', primitive: 'number' },
];
