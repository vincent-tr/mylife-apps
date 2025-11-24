export default {
  id: 'upsmon-summary',
  parent: 'base',
  name: 'Résumé Upsmon',
  fields: [
    { id: 'date', name: "Date/heure auxquels les informations ont été obtenus de l'onduleur", datatype: 'datetime' },
    { id: 'upsName', name: "Nom de l'onduleur", datatype: 'name' },
    { id: 'status', name: "Statut de l'onduleur", datatype: 'name' },
  ],
};
