export default {
  id: 'bot-run',
  parent: 'base',
  name: 'Execution de robot',
  fields: [
    { id: 'bot', name: 'Robot', datatype: 'bot' },
    { id: 'start', name: 'Début', datatype: 'datetime' },
    { id: 'end', name: 'Fin', datatype: 'datetime' },
    { id: 'result', name: 'Résultat', datatype: 'bot-run-result' },
    { id: 'logs', name: 'Logs', datatype: 'list:bot-run-log' }
  ],
};
