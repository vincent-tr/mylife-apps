'use strict';

module.exports = {
  id: 'nagios-host',
  parent: 'base',
  name: 'Hôte nagios',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'group', name: 'Groupe', datatype: 'nagios-host-group', constraints: ['not-null'] },
    { id: 'status', name: 'Statut', datatype: 'nagios-host-status' },
    { id: 'statusText', name: 'Texte du statut', datatype: 'text' },
    { id: 'currentAttempt', name: 'Tentative courante', datatype: 'count' },
    { id: 'maxAttempts', name: 'Tentatives totales', datatype: 'count' },
    { id: 'lastCheck', name: 'Dernier check', datatype: 'datetime' },
    { id: 'nextCheck', name: 'Prochain check', datatype: 'datetime' },
    { id: 'lastStateChange', name: 'Dernier changement d\'état', datatype: 'datetime' },
    { id: 'isFlapping', name: 'Instable', datatype: 'boolean' },
  ],
  display: obj => obj.display
};
