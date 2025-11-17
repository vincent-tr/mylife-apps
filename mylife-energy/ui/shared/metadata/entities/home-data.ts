import { views } from 'mylife-tools-ui';

export interface HomeData extends views.Entity {
	section: string;
	key: string;
	value: any;
}
