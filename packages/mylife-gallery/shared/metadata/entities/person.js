'use strict';

module.exports = {
  id: 'person',
  parent: 'base',
  name: 'Personne',
  fields: [
    { id: 'lastName', name: 'Nom', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'firstName', name: 'Prénom', datatype: 'text', constraints: ['not-null', 'not-empty'] },
    { id: 'thumbnails', name: 'Miniatures', datatype: 'any' }, // id array
  ],
  display: obj => `${obj.firstName} ${obj.lastName}`
};
