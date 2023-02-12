export default {
  id: 'bot',
  parent: 'base',
  name: 'Robot',
  fields: [
    { id: 'type', name: 'Type', datatype: 'bot-type' },
    { id: 'name', name: 'Nom', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'schedule', name: 'Planification', datatype: 'cron', constraints: ['not-null', 'not-empty'] },
    { id: 'configuration', name: 'Configuration', datatype: 'any' },
    { id: 'state', name: 'Etat', datatype: 'any' },
  ],
  display: obj => obj.name
};
