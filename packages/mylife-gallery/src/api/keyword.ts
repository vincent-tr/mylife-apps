import * as business from '../business';
import { base } from './decorators';

export const meta = {
  name : 'keyword'
};

export const notifyKeywords = [ base, (session) => {
  return business.keywordsNotify(session);
} ];
