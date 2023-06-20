export default {
  id: 'sensor',
  parent: 'base',
  name: 'Capteur',
  fields: [
    { id: 'sensorId', name: 'Date/heure', datatype: 'datetime', constraints: ['not-null'] },
    { id: 'deviceClass', name: 'Classe du périphérique', datatype: 'name', constraints: ['not-null'] },
    { id: 'stateClass', name: 'Classe d\'état', datatype: 'name', constraints: ['not-null'] },
    { id: 'unitOfMeasurement', name: 'Unité de mesure', datatype: 'name', constraints: ['not-null'] },
    { id: 'accuracyDecimals', name: 'Précision (nombre de décimals)', datatype: 'count', constraints: ['not-null'] },
  ],
  display: obj => `${obj.date} => ${obj.value}`
};
