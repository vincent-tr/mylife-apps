'use strict';

module.exports = [
  { id: 'cron', primitive: 'string' },
  { id: 'bot-type', enum: ['cic-sscraper'] },
  { id: 'bot-run-result', enum: ['success', 'warning', 'error'] },
  {
    id: 'bot-run-log', structure: [
      { id: 'date', name: 'Date', datatype: 'datatime' },
      { id: 'severity', name: 'Gravité', datatype: 'bot-run-log-severity' },
      { id: 'name', name: 'Nom du logger', datatype: 'name' },
      { id: 'message', name: 'Message', datatype: 'text' },
    ]
  },
  { id: 'bot-run-log-severity', enum: ['debug', 'info', 'warning', 'error', 'fatal'] },
];
