'use strict';

module.exports = {
  id: 'nagios-summary',
  parent: 'base',
  name: 'Résume Nagios',
  fields: [
    { id: 'type', name: 'Type d\'objet', datatype: 'nagios-object-type' },
    { id: 'ok', name: 'Nombre OK', datatype: 'count' },
    { id: 'warnings', name: 'Nombre de OK', datatype: 'count' },
    { id: 'errors', name: 'Nombre de warnings', datatype: 'count' },
    { id: 'type', name: 'Nombre d\'erreurs', datatype: 'count' },
  ]
};
