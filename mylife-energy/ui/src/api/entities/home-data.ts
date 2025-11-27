import { api } from 'mylife-tools';

export interface HomeData extends api.Entity {
  section: string;
  key: string;
  value: any;
}
