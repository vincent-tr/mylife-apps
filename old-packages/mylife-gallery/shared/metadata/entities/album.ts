export default {
  id: 'album',
  parent: 'base',
  name: 'Album',
  fields: [
    { id: 'title', name: 'Titre', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'caption', name: 'Légende', datatype: 'text' },
    { id: 'documents', name: 'Documents', datatype: 'list:document-reference' },
    { id: 'keywords', name: 'Mots clés', datatype: 'list:name', constraints: ['not-null'], initial: [] },
    { id: 'thumbnails', name: 'Miniatures', datatype: 'list:identifier', constraints: ['not-null'], initial: [] }, // we do not directly reference thumbnail because it is not loaded as store collection
  ],
  display: obj => obj.title
};
