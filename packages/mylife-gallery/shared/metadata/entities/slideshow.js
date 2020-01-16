'use strict';

module.exports = {
  id: 'slideshow',
  parent: 'base',
  name: 'Diaporama',
  fields: [
    { id: 'name', name: 'Nom', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'albums', name: 'Albums', datatype: 'list:album', constraints: ['not-null'], initial: [] },
    { id: 'style', name: 'Style', datatype: 'slideshow-style', constraints: ['not-null'] },
  ],
  display: obj => obj.name
};
