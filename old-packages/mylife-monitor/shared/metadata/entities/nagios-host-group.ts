export default {
  id: 'nagios-host-group',
  parent: 'base',
  name: 'Groupe d\'hôtes nagios',
  fields: [
    { id: 'code', name: 'Code', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'display', name: 'Affichage', datatype: 'name', constraints: ['not-null', 'not-empty'] },
  ],
  display: obj => obj.display
};
