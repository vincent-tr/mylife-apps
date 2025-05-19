export default [
  { id: 'cron', primitive: 'string' },
  { id: 'bot-type', enum: ['noop', 'cic-scraper', 'frais-scraper', 'amazon-scraper', 'paypal-scraper'] },
  { 
    id: 'bot-run', structure: [
      { id: 'start', name: 'Début', datatype: 'datetime' },
      { id: 'end', name: 'Fin', datatype: 'datetime' },
      { id: 'result', name: 'Résultat', datatype: 'bot-run-result' },
      { id: 'logs', name: 'Logs', datatype: 'list:bot-run-log' }
    ]
  },
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
