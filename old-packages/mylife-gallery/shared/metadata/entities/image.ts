export default {
  id: 'image',
  parent: 'document',
  name: 'Image',
  fields: [
    { id: 'perceptualHash', name: 'Hash perception', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'thumbnail', name: 'Miniature', datatype: 'identifier' }, // we do not directly reference thumbnail because it is not loaded as store collection
    { id: 'media', name: 'Média', datatype: 'media' },
    { id: 'metadata', name: 'Métadonnées', datatype: 'image-metadata' },
    { id: 'width', name: 'Largeur', datatype: 'count' },
    { id: 'height', name: 'Hauteur', datatype: 'count' },
    { id: 'date', name: 'Date de prise de photo', datatype: 'datetime' },
    { id: 'persons', name: 'Personnes', datatype: 'list:person', constraints: ['not-null'], initial: [] },
  ]
};
