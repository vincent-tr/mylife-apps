import { api } from 'mylife-tools';

export interface HomeData extends api.Entity {
  _entity: 'home-data';
  section: string;
  key: string;
  value: any;
}
