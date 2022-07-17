import * as business from '../business';
import { base } from './decorators';

export const meta = {
  name : 'stats'
};

export const notifyStats = [ base, (session/*, message*/) => {
  return business.statsNotify(session);
} ];
