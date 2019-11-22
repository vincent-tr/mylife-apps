'use strict';

module.exports = {
  id: 'person',
  parent: 'base',
  name: 'Personne',
  fields: [
    { id: 'lastName', name: 'Nom', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'firstName', name: 'Prénom', datatype: 'text', constraints: ['not-null', 'not-empty'] },
    { id: 'thumbnails', name: 'Miniatures', datatype: 'list:identifier', constraints: ['not-null'], initial: [] }, // we do not directly reference thumbnail because it is not loaded as store collection
  ],
  display: obj => `${obj.firstName} ${obj.lastName}`
};
