export default {
  id: 'bot',
  parent: 'base',
  name: 'Robot',
  fields: [
    { id: 'type', name: 'Type', datatype: 'bot-type' },
    { id: 'schedule', name: 'Planification', datatype: 'cron', constraints: ['not-null', 'not-empty'] },
    { id: 'lastRun', name: 'Dernière exécution', datatype: 'bot-run' },
  ],
  display: (obj) => obj.name,
};
