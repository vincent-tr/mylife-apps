import { api } from 'mylife-tools';

export default {
  id: 'sensor',
  parent: 'base',
  name: 'Capteur',
  fields: [
    { id: 'sensorId', name: 'Identifiant', datatype: 'name', constraints: ['not-null'] },
    { id: 'deviceClass', name: 'Classe du périphérique', datatype: 'name', constraints: ['not-null'] },
    { id: 'stateClass', name: "Classe d'état", datatype: 'name', constraints: ['not-null'] },
    { id: 'unitOfMeasurement', name: 'Unité de mesure', datatype: 'name', constraints: ['not-null'] },
    { id: 'accuracyDecimals', name: 'Précision (nombre de décimals)', datatype: 'count', constraints: ['not-null'] },
  ],
  display: (obj) => `${obj.date} => ${obj.value}`,
};

export interface Sensor extends api.Entity {
  sensorId: string;
  sensor: string;
  deviceClass: string;
  stateClass: string;
  unitOfMeasurement: string;
  accuracyDecimals: number;
}
