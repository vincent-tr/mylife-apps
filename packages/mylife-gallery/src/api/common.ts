import { api } from 'mylife-tools-server';
import { base } from './decorators';
import * as business from '../business';

export const meta = {
  name : 'common'
};

export const unnotify = [ base, api.services.createUnnotify() ];

export const renotifyWithCriteria = [ base, (session, message) => {
  const { viewId, criteria } = message;
  return business.renotifyWithCriteria(session, viewId, criteria);
} ];
