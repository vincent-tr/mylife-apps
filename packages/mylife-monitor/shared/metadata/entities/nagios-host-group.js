'use strict';

module.exports = {
  id: 'nagios-host-group',
  parent: 'base',
  name: 'Groupe d\'hôtes nagios',
  fields: [
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
  ],
  display: obj => obj.display
};
