export default {
  id: 'video',
  parent: 'document',
  name: 'Video',
  fields: [
    { id: 'thumbnails', name: 'Miniatures', datatype: 'list:identifier', constraints: ['not-null'], initial: [] },
    { id: 'media', name: 'Média', datatype: 'media' },
    { id: 'metadata', name: 'Métadonnées', datatype: 'video-metadata' },
    { id: 'width', name: 'Largeur', datatype: 'count' },
    { id: 'height', name: 'Hauteur', datatype: 'count' },
    { id: 'duration', name: 'Durée', datatype: 'real' },
    { id: 'date', name: 'Date de prise de vidéo', datatype: 'datetime' },
    { id: 'persons', name: 'Personnes', datatype: 'list:person', constraints: ['not-null'], initial: [] },
  ]
};
