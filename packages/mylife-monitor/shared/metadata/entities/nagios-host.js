'use strict';

module.exports = {
  id: 'nagios-host',
  parent: 'base',
  name: 'Hôte nagios',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'group', name: 'Groupe', datatype: 'nagios-host-group', constraints: ['not-null'] },
  ],
  display: obj => obj.display
};
