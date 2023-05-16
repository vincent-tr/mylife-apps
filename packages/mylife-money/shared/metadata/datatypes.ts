export default [
  { id: 'cron', primitive: 'string' },
  { id: 'bot-type', enum: ['noop', 'cic-scraper', 'frais-scraper'] },
  { id: 'bot-run-result', enum: ['success', 'warning', 'error'] },
  {
    id: 'bot-run-log', structure: [
      { id: 'date', name: 'Date', datatype: 'datetime' },
      { id: 'severity', name: 'Gravité', datatype: 'bot-run-log-severity' },
      { id: 'message', name: 'Message', datatype: 'text' },
    ]
  },
  { id: 'bot-run-log-severity', enum: ['debug', 'info', 'warning', 'error', 'fatal'] },
];
