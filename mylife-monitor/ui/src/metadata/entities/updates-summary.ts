export default {
  id: 'updates-summary',
  parent: 'base',
  name: 'Résumé Updates',
  fields: [
    { id: 'category', name: 'Categorie', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'ok', name: 'OK', datatype: 'count' },
    { id: 'outdated', name: 'Dépassés', datatype: 'count' },
    { id: 'unknown', name: 'Inconnus', datatype: 'count' },
  ],
  display: (obj) => obj.category,
};
