import { views } from 'mylife-tools';

export default {
  id: 'measure',
  parent: 'base',
  name: 'Mesure',
  fields: [
    { id: 'timestamp', name: 'Date/heure', datatype: 'datetime', constraints: ['not-null'] },
    { id: 'value', name: 'Valeur', datatype: 'real', constraints: ['not-null'] },
    { id: 'sensor', name: 'Capteur', datatype: 'sensor', constraints: ['not-null'] },
  ],
  display: (obj) => `${obj.date} => ${obj.value}`,
};

export interface Measure extends views.Entity {
  timestamp: Date;
  sensor: string;
  value: number;
}
