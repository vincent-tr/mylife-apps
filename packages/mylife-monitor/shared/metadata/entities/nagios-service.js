'use strict';

module.exports = {
  id: 'nagios-service',
  parent: 'base',
  name: 'Service nagios',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'host', name: 'Hôte', datatype: 'nagios-host', constraints: ['not-null'] },
  ],
  display: obj => obj.display
};
