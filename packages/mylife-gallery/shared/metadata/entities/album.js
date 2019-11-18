'use strict';

module.exports = {
  id: 'album',
  parent: 'base',
  name: 'Album',
  fields: [
    { id: 'title', name: 'Titre', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'caption', name: 'Légende', datatype: 'text', constraints: ['not-null', 'not-empty'] },
    - liste de photos
    - mots clés
    - thumbnail(s) affichage
  ],
  display: obj => obj.title
};
