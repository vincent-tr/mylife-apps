import { views } from 'mylife-tools';

export interface HomeData extends views.Entity {
  section: string;
  key: string;
  value: any;
}
