export default {
  id: 'updates-version',
  parent: 'base',
  name: 'Version',
  fields: [
    { id: 'path', name: 'Chemin', datatype: 'list:name', constraints: ['not-null', 'not-empty'] },
    { id: 'status', name: 'Etat', datatype: 'updates-status' },
    { id: 'currentVersion', name: 'Version courante', datatype: 'version' },
    { id: 'currentCreated', name: 'Date de création (courante)', datatype: 'datetime' },
    { id: 'latestVersion', name: 'Dernière version', datatype: 'version' },
    { id: 'latestCreated', name: 'Date de création (dernière)', datatype: 'datetime' },
  ],
  display: (obj) => obj.path.join('.'),
};
